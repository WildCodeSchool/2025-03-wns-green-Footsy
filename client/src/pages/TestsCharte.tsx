import MainButton from "../components/MainButton/MainButton";

export default function TestCharte() {
  return (
    <>
      <p>This is a dev environment to test some chart components</p>
      <MainButton mode="light" content="Short" />
      <MainButton mode="dark" content="This is a longer and dark button" />
      <MainButton mode="accent" content="Accent Color" />
    </>
  );
}
