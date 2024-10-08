import { TiEdit } from "react-icons/ti";
import { useSession, useUser } from "../../stores/useSession";

import { toast } from "sonner";
import Swal from "sweetalert2";
import { putUserFn } from "../../api/users";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import Input from "../Input/Input";
import { useEffect, useState } from "react";

import "./UserProfile.css";

const Profile = () => {
  //-----------------------Zustand----------------------------------------------
  const { user } = useSession();
  const { clearUser } = useUser();
  
  //-----------------------RHF----------------------------------------------
  const {
    register,
    handleSubmit: onSubmitRHF,
    formState: { errors },
    setValue,
    
  } = useForm();

  const [editingFields, setEditingFields] = useState({});
  const [userName, setUserName] = useState(user.firstname);

  useEffect(() => {
    if (user) {
      setValue("firstname", user.firstname);
      setValue("lastname", user.lastname);
      setValue("email", user.email);
      setUserName(user.firstname);
    }
  }, [user, setValue]);

  //-----------------------TQUERY----------------------------------------------

  const { mutate: putUser } = useMutation({
    mutationFn: putUserFn,
    onSuccess: () => {
      // mensaje de exito
      Swal.close();
      toast.success("Usuario actualizado");
      //limpiar estado global
      clearUser();
      setEditingFields({});
    },
    onError: () => {
      Swal.close();
      toast.error("Ocurrió un error al guardar el usuario");
    },
  });
  //-----------------------HANDLERS----------------------------------------------

  //edición
  const handleEditField = (fieldName) => {
    setEditingFields((prevFields) => ({
      ...prevFields,
      [fieldName]: !prevFields[fieldName],
    }));
  };

  // Submit
  const handleSubmit = (data) => {
    Swal.showLoading();
    const newData = {
      
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,

    };
    putUser({ ...newData, id: user.id });
    setUserName(data.firstname);
    return;
  };
 

  return (
    <article className="container perfilContainer text-center">
      <form onSubmit={onSubmitRHF(handleSubmit)}>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/800px-User-avatar.svg.png"
          alt=""
          className="profileImg my-4"
        />
        <h1>Welcome {userName}</h1>
        <div className="text-center">
            <div className="d-flex ms-4">
              <Input
                name="firstname"
                register={register}
                error={!!errors?.firstname}
                className="my-2"
                options={{
                  minLength: 3,
                  maxLength: 25,
                  required: true,
                }}
                readOnly={!editingFields.firstname}
              />
              <button
                type="button"
                className="btnEdit btn"
                onClick={() => handleEditField("firstname")}
              >
                <TiEdit />
              </button>
            </div>
            <div className="d-flex ms-4">
              <Input
                name="lastname"
                register={register}
                error={!!errors?.lastname}
                className="my-2"
                options={{
                  minLength: 3,
                  maxLength: 25,
                  required: true,
                }}
                readOnly={!editingFields.lastname}
              />
              <button
                type="button"
                className="btnEdit btn"
                onClick={() => handleEditField("lastname")}
              >
                <TiEdit />
              </button>
            </div>
            <div className="d-flex ms-4">
              <Input
                type="email"
                name="email"
                register={register}
                error={!!errors?.email}
                className="my-2"
                options={{
                  minLength: 3,
                  maxLength: 25,
                  required: true,
                }}
                readOnly={!editingFields.email}
              />
              <button
                type="button"
                className="btnEdit btn"
                onClick={() => handleEditField("email")}
              >
                <TiEdit />
              </button>
            </div>
            <div className="mt-3">
              <button type="submit" className="btn" id="btnSave">
                Save
              </button>
            </div>
          </div>
      </form>
    </article>
  );
};

export default Profile;
