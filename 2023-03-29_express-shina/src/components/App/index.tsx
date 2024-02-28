import "./styles.scss";
import Order from "../Order";
import Header from "../Header";
import Footer from "../Footer";

function App() {
  return (
    <div className="root">
      <Header />
      <Order />
      <Footer />
    </div>
  );
}

export default App;
