"use client";
import { useForm } from "react-hook-form";
import { createClient } from "@/app/lib/supabase/browser-client"

type ForgotPasswordFormValues = {
    email: string;
};

export default function ForgotPasswordPage() {
    const supabase = createClient();

    const{
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ForgotPasswordFormValues>({
        defaultValues: {email: ""},
        mode: "onSubmit",
    });

    const onSubmit = async (values: ForgotPasswordFormValues) => {
        const {error} = await supabase.auth.resetPasswordForEmail(values.email);

        if (error) {
            alert(error.message);
            return;
        }


        alert("Instructions to reset your password have been sent to your email.")
    };
    
    return (
        <div>
            <h1>Reset Password</h1>

            <form onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="email">Email</label>
                
                <input
                id="email"
                type="email"
                {...register("email", {
                    required: "Email is required.",
                    pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Please enter a valid email address.",
                    },
                })}
                />

                {errors.email?.message ? <p>{errors.email.message}</p> : null}

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Sending" : "Reset password"}
                </button>
            </form>
        </div>
    );
}
