import logoOutline from "public/images/goods-icon-outline.svg";

export default function Footer() {
  return (
    <footer id="footer" className="flex justify-center">
      <div className="footer-content">
        <img className="footer-icon mr-2" src={logoOutline} />
        <p>Scant Goods</p>
      </div>
    </footer>
  )
}