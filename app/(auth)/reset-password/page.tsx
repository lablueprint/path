"use client";
import { useForm } from "react-hook-form";
import { createClient } from "../../lib/supabase/browser-client";
import { useRouter } from "next/navigation";

type ResetPasswordFormValues = {
  password: string;
  passwordConfirmation: string;
};

export default function ResetPasswordPage() {
  const supabase = createClient();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    defaultValues: { password: "", passwordConfirmation: "" },
    mode: "onChange",
  });

  const passwordValue = watch("password");

  const onSubmit = async (values: ResetPasswordFormValues) => {
    const { error } = await supabase.auth.updateUser({
      password: values.password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Your password has been updated.");
    router.push("/home");
  };

  return (
    <div>
      <h1>Reset Password</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="password">New password</label>
        <input
          id="password"
          type="password"
          {...register("password", {
            required: "New password is required.",
            pattern: {
              value:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\+\-=\[\]{};':"\\|<>?,.\/`~]).{8,}$/,
              message:
                "Password must be at least 8 characters and include uppercase, lowercase, a number, and a symbol.",
            },
          })}
        />
        {errors.password?.message ? <p>{errors.password.message}</p> : null}

        <br />

        <label htmlFor="passwordConfirmation">New password confirmation</label>
        <input
          id="passwordConfirmation"
          type="password"
          {...register("passwordConfirmation", {
            required: "Password confirmation is required.",
            validate: (value) =>
              value === passwordValue || "Passwords do not match.",
          })}
        />
        {errors.passwordConfirmation?.message ? (
          <p>{errors.passwordConfirmation.message}</p>
        ) : null}

        <br />

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}
