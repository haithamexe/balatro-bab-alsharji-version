import { JOKER_BY_ID } from "../../../game/content/jokers";
import type { ShopOffer } from "../../../game/types/run";

interface ShopProps {
  money: number;
  offers: ShopOffer[];
  onBuy: (offerId: string) => void;
  onContinue: () => void;
}

export function Shop({ money, offers, onBuy, onContinue }: ShopProps) {
  return (
    <section>
      <h2 className="panel-title">Shop</h2>
      <div className="shop-grid">
        {offers.map((offer) => {
          const joker = JOKER_BY_ID[offer.jokerId];

          if (!joker) {
            return null;
          }

          return (
            <article className="shop-card" key={offer.id}>
              <h4>{joker.name}</h4>
              <p className="muted">{joker.description}</p>
              <footer>
                <span>${offer.price}</span>
                <button
                  type="button"
                  disabled={offer.sold || money < offer.price}
                  onClick={() => onBuy(offer.id)}
                >
                  {offer.sold ? "Sold" : "Buy"}
                </button>
              </footer>
            </article>
          );
        })}
      </div>
      <div className="shop-actions" style={{ marginTop: "1rem" }}>
        <button className="button-primary" type="button" onClick={onContinue}>
          Continue To Next Blind
        </button>
      </div>
    </section>
  );
}
