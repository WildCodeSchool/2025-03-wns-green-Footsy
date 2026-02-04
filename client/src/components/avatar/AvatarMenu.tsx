import { useState, useEffect, useRef } from "react";
import type { User } from "../../types/User.types";
import { LOGOUT } from "../../graphql/operations";
import styles from "./AvatarMenu.module.scss";
import { toast } from "react-toastify";
import { useMutation } from "@apollo/client/react/react.cjs";
import { Link } from "react-router";

export default function AvatarMenu({ user }: { user: User }) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { image } = user.avatar;
    const url = new URL(`../../assets/img/avatar/${image}`, import.meta.url).href;
    const [logoutMutation] = useMutation(LOGOUT);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open]);

    const handleLogout = async () => {
        try {
            await logoutMutation();
            window.location.href = "/login";
        } catch (error) {
            toast.error("Logout failed.");
        }
    };

    return (
        <div className={styles.avatar} ref={menuRef}>
            <img
                className={styles.avatar__image}
                src={url}
                alt="User Avatar"
                onClick={() => setOpen(!open)}
            />
            {open && (
                <div
                    className={`${styles.avatar__menu} ${open ? styles["avatar__menu--open"] : ""}`}
                >
                    <p className={styles.avatar__menu__header}>{user.first_name} - <span>{user.email}</span></p>
                    <Link
                        className={`${styles.avatar__menu__item} ${styles["avatar__menu__item--link"]}`}
                        to="/settings"
                    >
                        Paramètres
                    </Link>
                    <button
                        className={`${styles.avatar__menu__item} ${styles["avatar__menu__item--link"]}`}
                        onClick={handleLogout}
                    >
                        Se déconnecter
                    </button>
                </div>
            )}
        </div>
    );
}