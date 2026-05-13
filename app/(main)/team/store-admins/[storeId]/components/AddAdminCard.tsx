"use client";

import { User } from "@/app/types/user";
import Image from "next/image";
import styles from "@/app/(main)/components/Card.module.css";
import { Button } from "react-bootstrap";
import imagePlaceholder from "@/public/image-placeholder.svg";

interface AddAdminCardProps {
    user: User;
}

export default function AddAdminCard({ user }: AddAdminCardProps) {
     const profilePhoto = user.profile_photo_url?.trim() || imagePlaceholder;

    return (
        <div className={styles.card}>
            <Image
                src={profilePhoto || "/images/default-user.png"}
                alt={user.first_name + " " + user.last_name}
                width={100}
                height={100}
                className={styles.image}
            />
            <div className={styles.text}>
                <p className={styles.name}>{user.first_name + " " + user.last_name}</p>
                <p className={styles.cardText}>{user.email}</p>
                <Button variant="primary" className="delete-button">
                    Remove as Admin
                </Button>
            </div>
        </div>
    );
}
