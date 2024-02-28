import "./styles.scss";

export default function Footer() {
  const date = new Date();

  return (
    <div className="footer">
      <p>Даниил Коваленко</p>
      <p>{date.getFullYear()}</p>
    </div>
  );
}
