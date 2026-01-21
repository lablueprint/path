"use client";

import { DonationInsert } from "../../../../../types/Donation";
import { useForm, Controller } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { createDonation } from "@/app/api/donations/actions";

type FormData = {
  donor_type?: "individual" | "business";

  individual_name?: string;
  business_name?: string;
  business_contact_name?: string;

  email: string;
  phone: string;
  address: string;
  receiving_site: string;

  receive_emails: boolean;
  receive_mailings: boolean;
  remain_anonymous: boolean;

  estimated_value: number | null;
  items_donated: string;
};

export default function DonationForm() {
  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    clearErrors,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      donor_type: undefined,
      phone: "",
      estimated_value: null,
    }
  });

  const donorType = watch("donor_type");

  const onSubmit = async (data: FormData) => {
    const donation: DonationInsert = {
      receiver_user_id: "00000000-0000-0000-0000-000000000000", // TODO: real ID
      store_id: null,

      donor_is_individual: data.donor_type === "individual",

      donor_individual_name:
        data.donor_type === "individual"
          ? data.individual_name ?? null
          : null,

      donor_business_name:
        data.donor_type === "business"
          ? data.business_name ?? null
          : null,

      donor_business_contact_name:
        data.donor_type === "business"
          ? data.business_contact_name ?? null
          : null,

      donor_email: data.email ?? null,
      donor_phone: data.phone ?? null,
      donor_street_address: data.address ?? null,

      donor_receive_emails: data.receive_emails,
      donor_receive_mailings: data.receive_mailings,
      donor_remain_anonymous: data.remain_anonymous,

      estimated_value: data.estimated_value,
      items_donated: data.items_donated,
    };
    try {
      const result = await createDonation(donation);
      console.log("Donation created:", result);

      // Reset all fields to empty/default values
      reset({
        donor_type: undefined,
        individual_name: "",
        business_name: "",
        business_contact_name: "",
        email: "",
        phone: "",
        address: "",
        receiving_site: "",
        receive_emails: false,
        receive_mailings: false,
        remain_anonymous: false,
        estimated_value: null,
        items_donated: "",
      });
      clearErrors();

    } catch (error) {
      console.error("Failed to create donation:", error);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px", fontFamily: "Arial, sans-serif" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center", 
          gap: "1rem", 
          marginTop: "20px",
          marginBottom: "20px",
          justifyContent: "center",
        }}
      >
        <h1 style={{ margin: 0 }}>Donation Form</h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>

        {/* Receiving Site */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ fontWeight: "bold", marginBottom: "5px" }}>Receiving site</label>
          <select {...register("receiving_site")} defaultValue="" style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}>
            <option value="" disabled>Select a receiving site</option>
            <option value="path-site-1">PATH site 1</option>
            <option value="path-site-2">PATH site 2</option>
            <option value="path-site-3">PATH site 3</option>
          </select>
        </div>

        {/* Donor Type */}
        <Controller
          name="donor_type"
          control={control}
          rules={{ required: "Please select a donor type" }}
          render={({ field }) => (
            <>
              <label>
                <input
                  type="radio"
                  value="individual"
                  checked={field.value === "individual"}
                  onChange={() => field.onChange("individual")}
                /> Individual
              </label>
              <label>
                <input
                  type="radio"
                  value="business"
                  checked={field.value === "business"}
                  onChange={() => field.onChange("business")}
                /> Business
              </label>
              {errors.donor_type && <p style={{ color: "red" }}>{errors.donor_type.message}</p>}
            </>
          )}
        />

        {/* Conditional Name Fields */}
        {donorType === "individual" && (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ fontWeight: "bold", marginBottom: "5px" }}>Individual Name</label>
            <input {...register("individual_name", { required: true })} style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} />
          </div>
        )}

        {donorType === "business" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ fontWeight: "bold", marginBottom: "5px" }}>Business Name</label>
              <input {...register("business_name", { required: true })} style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ fontWeight: "bold", marginBottom: "5px" }}>Business Contact Name</label>
              <input {...register("business_contact_name", { required: true })} style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} />
            </div>
          </div>
        )}

        {/* Email */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ fontWeight: "bold", marginBottom: "5px" }}>Donor Email</label>
          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email address",
              },
            })}
            style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
          {errors.email && <p style={{ color: "red", marginTop: "5px" }}>{errors.email.message}</p>}
        </div>

        {/* Phone */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ fontWeight: "bold", marginBottom: "5px" }}>Donor Phone Number (Optional)</label>
          <Controller
            name="phone"
            control={control}
            rules={{
              validate: (value) => {
                const digits = value?.replace(/\D/g, "");
                return (
                  !digits || digits.length === 10 || "Phone number must be 10 digits"
                );
              },
            }}
            render={({ field }) => (
              <PatternFormat
                {...field}
                format="(###) ###-####"
                mask="_"
                placeholder="(415) 555-1234"
                allowEmptyFormatting
                onValueChange={(values) => {
                  // store digits only: "4155551234"
                  field.onChange(values.value);
                }}
                style={{
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
            )}
          />
          {errors.phone && <p style={{ color: "red", marginTop: "5px" }}>{errors.phone.message}</p>}
        </div>

        {/* Street Address */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ fontWeight: "bold", marginBottom: "5px" }}>Donor Street Address</label>
          <input
            {...register("address", { required: "Street address is required" })}
            style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
          {errors.address && <p style={{ color: "red", marginTop: "5px" }}>{errors.address.message}</p>}
        </div>

        {/* Checkboxes */}
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label>
            <input type="checkbox" {...register("receive_emails")} /> Donor receive emails?
          </label>
          <label>
            <input type="checkbox" {...register("receive_mailings")} /> Donor receive mailings?
          </label>
          <label>
            <input type="checkbox" {...register("remain_anonymous")} /> Donor remain anonymous?
          </label>
        </div>

        {/* Estimated Value */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ fontWeight: "bold", marginBottom: "5px" }}>
            Estimated value (USD)
          </label>

          <input
            type="text"
            placeholder="1,234.00"
            {...register("estimated_value", {
              required: "Estimated donation value is required",
              pattern: {
                value: /^\d+(\.\d{1,2})?$/,
                message: "Please enter a valid dollar amount in the form 1234.56",
              },
            })}
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />

          {errors.estimated_value && (
            <p style={{ color: "red", marginTop: "5px" }}>
              {errors.estimated_value.message}
            </p>
          )}
        </div>

        {/* Items Donated */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ fontWeight: "bold", marginBottom: "5px" }}>Items donated</label>
          <input
            type="text"
            placeholder="Describe the items you are donating"
            {...register("items_donated", {
              required: "Please enter the items you are donating",
              maxLength: {
                value: 500,
                message: "Items description cannot exceed 500 characters",
              },
            })}
            style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
          {errors.items_donated && <p style={{ color: "red", marginTop: "5px" }}>{errors.items_donated.message}</p>}
        </div>

        <button
          type="submit"
          style={{
            marginTop: "20px",
            padding: "10px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#007bff",
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}
