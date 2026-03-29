import { JOKER_BY_ID } from "../../../game/content/jokers";
import type { ShopOffer } from "../../../game/types/run";
import { StickerArt } from "../StickerArt/StickerArt";

interface ShopProps {
  money: number;
  offers: ShopOffer[];
  onBuy: (offerId: string) => void;
  onContinue: () => void;
}

export function Shop({ money, offers, onBuy, onContinue }: ShopProps) {
  return (
    <section>
      <div className="panel-heading">
        <div>
          <p className="panel-kicker">Between Blinds</p>
          <h2 className="panel-title">Shop</h2>
        </div>
        <StickerArt icon="satchel" stamp="SHOP" size="panel" tone="ember" />
      </div>
      <div className="shop-grid">
        {offers.map((offer) => {
          const joker = JOKER_BY_ID[offer.jokerId];

          if (!joker) {
            return null;
          }

          return (
            <article className="shop-card" key={offer.id}>
              <StickerArt icon={joker.art.icon} stamp={joker.art.stamp} size="card" tone={joker.art.tone} />
              <div className="info-block">
                <div className="card-headline">
                  <h4>{joker.name}</h4>
                  <span className={`rarity-pill rarity-pill--${joker.rarity}`}>{joker.rarity}</span>
                </div>
                <p className="muted">{joker.description}</p>
              </div>
              <footer>
                <span className="price-chip">${offer.price}</span>
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
