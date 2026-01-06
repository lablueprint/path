'use client';
import { createClient } from '@/app/lib/supabase/browser-client';
import { useForm, SubmitHandler} from "react-hook-form"


type FormInput = {
    email: string
    password: string
}

export default function SignInPage() {
    const {register, handleSubmit, formState:{errors }
    } = useForm<FormInput>()
    const supabase = createClient();

    const onSubmit = async (Input: FormInput) => {
        const {data, error} = await supabase.auth.signInWithPassword( {
            email: Input.email,
            password: Input.password
        })
        if (error) {
            console.log(error)
        }

    }
    
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register("email", {pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/, required: true})}
            placeholder = "Email"
            />
            {errors.email?.type === "required" && (
                <p role = "alert"> Email is required </p>
            )}
            {errors.email?.type === "pattern" && (
                <p role = "alert">Invalid Email</p>
            )}
            <input {...register("password", {required: true})} 
            placeholder = "Password"/>

            {errors.password?.type === "required" && (
                <p role = "alert"> Password is required </p>
            )}
            <button type="submit">Sign In</button>
        </form>
    )

}
