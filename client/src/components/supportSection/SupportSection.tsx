import { useMode } from "../../context/modeContext";
import MainButton from "../mainButton/MainButton";

import classes from "./SupportSection.module.scss";

type SupportSectionProps = {
	amountRaised?: number;
	onDonateClick?: () => void;
};

export default function SupportSection({
	amountRaised = 300,
	onDonateClick,
}: SupportSectionProps) {
	const { mode } = useMode();

	const handleDonateClick = () => {
		if (onDonateClick) {
			onDonateClick();
		}
	};

	return (
		<div className={classes["support-section"]}>
			<h3 className={classes["support-section__title"]}>
				Envie de soutenir l'app ?
			</h3>
			<div className={classes["support-section__content"]}>
				<MainButton
					type="button"
					mode={mode}
					content="Participer au pot commun"
					onClick={handleDonateClick}
				/>
				<div className={classes["support-section__amount"]}>
					<span className={classes["support-section__amount-value"]}>
						{amountRaised}€
					</span>
					<span className={classes["support-section__amount-label"]}>
						récoltés à ce jour
					</span>
				</div>
			</div>
		</div>
	);
}
