import { useQuery } from "@apollo/client/react";
import { useEffect, useRef, useState } from "react";

import { GET_ALL_AVATARS } from "../../graphql/operations";

import { getAvatarImageUrl } from "../../services/avatarSelector.services";
import type { Avatar } from "../../types/Avatar.types";
import { Loader } from "../loader/Loader";
import classes from "./AvatarSelector.module.scss";

type GetAllAvatarsData = {
  getAllAvatars: Avatar[];
};

type AvatarSelectorProps = {
  selectedAvatar?: Avatar;
  onAvatarSelect: (avatar: Avatar) => void;
  label?: string;
};

export default function AvatarSelector({
  selectedAvatar,
  onAvatarSelect,
}: AvatarSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data, loading, error } = useQuery<GetAllAvatarsData>(GET_ALL_AVATARS);
  const avatars: Avatar[] = data?.getAllAvatars || [];

  const currentAvatar = selectedAvatar || avatars[4];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleAvatarClick = (avatar: Avatar) => {
    onAvatarSelect(avatar);
    setIsOpen(false);
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>Erreur</div>;
  }

  return (
    <div className={classes["avatar-selector"]} ref={dropdownRef}>
      <button
        type="button"
        className={classes["avatar-selector__current"]}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <img
          src={getAvatarImageUrl(currentAvatar.image)}
          alt={currentAvatar.title}
          className={classes["avatar-selector__current-image"]}
        />
      </button>

      {isOpen && (
        <div className={classes["avatar-selector__dropdown"]}>
          <div className={classes["avatar-selector__grid"]}>
            {avatars.map((avatar: Avatar) => (
              <option
                key={avatar.id}
                className={`${classes["avatar-selector__option"]} ${
                  currentAvatar?.id === avatar.id
                    ? classes["avatar-selector__option--selected"]
                    : ""
                }`}
                onClick={() => handleAvatarClick(avatar)}
                aria-selected={currentAvatar?.id === avatar.id}
              >
                <img
                  src={getAvatarImageUrl(avatar.image)}
                  alt={avatar.title}
                  className={classes["avatar-selector__option-image"]}
                />
              </option>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
