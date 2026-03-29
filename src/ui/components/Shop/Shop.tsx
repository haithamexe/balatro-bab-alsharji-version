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
    <section className="shop-panel">
      <div className="shop-panel__header">
        <div>
          <span className="board-label">Shop</span>
          <h2>Pick a joker</h2>
        </div>
        <div className="shop-panel__money">${money}</div>
      </div>

      <div className="shop-grid">
        {offers.map((offer) => {
          const joker = JOKER_BY_ID[offer.jokerId];

          if (!joker) {
            return null;
          }

          return (
            <article className="shop-card" key={offer.id}>
              <div className="shop-card__art">
                <StickerArt icon={joker.art.icon} stamp={joker.art.stamp} size="card" tone={joker.art.tone} />
              </div>
              <div className="shop-card__info">
                <div className="shop-card__headline">
                  <h3>{joker.name}</h3>
                  <span className={`rarity-pill rarity-pill--${joker.rarity}`}>{joker.rarity}</span>
                </div>
                <p>{joker.description}</p>
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
              </div>
            </article>
          );
        })}
      </div>

      <div className="shop-panel__actions">
        <button className="button-table" type="button" onClick={onContinue}>
          Continue
        </button>
      </div>
    </section>
  );
}
