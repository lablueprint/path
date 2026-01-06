import { useForm, SubmitHandler } from "react-hook-form"

type Inputs = {
    firstName : string 
    lastName : string
    email : string
    password : string
    passwordConfirmation : string
}

export default function SignUpPage() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Inputs>() 
    return ( 
        <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register("firstName", {required: true})} />
            <input {...register("lastName", {required: true})} />
            <input {...register("email", { required: true, pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/})} placeholder="email"/>

            {errors.email?.type === "required" && (
            <p role = "alert"> Email is required </p>
            )}
            {errors.email?.type === "pattern" && (
                <p role = "alert">Invalid Email</p>
            )}
            <input {...register("password", {required: true, minLength: 8, pattern: })}

        </form>

    )
}