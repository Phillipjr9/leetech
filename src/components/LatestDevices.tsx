import { useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Check, Phone } from "lucide-react";
import { latestDevices, type LatestDevice } from "../data/latest-devices";
import "./latest-devices.css";

export function LatestDevices({
  onExplore,
  onBrowse,
}: {
  onExplore: (device: LatestDevice) => void;
  onBrowse: () => void;
}) {
  const [selected, setSelected] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const reduced = useReducedMotion();
  const device = latestDevices[selected];

  function navigateTabs(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % latestDevices.length;
    else if (event.key === "ArrowLeft")
      next = (index + latestDevices.length - 1) % latestDevices.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = latestDevices.length - 1;
    else return;
    event.preventDefault();
    setSelected(next);
    tabs.current[next]?.focus({ preventScroll: true });
  }

  return (
    <section
      id="latest-devices"
      className="latest-devices-section"
      aria-labelledby="latest-devices-title"
    >
      <div className="container">
        <div className="section-heading latest-heading">
          <div>
            <span className="eyebrow">THE NEW GENERATION / 2026 EDIT</span>
            <h2 id="latest-devices-title">
              Latest devices. <em>First-class everything.</em>
            </h2>
            <p>
              The newest from Apple and Samsung. Your next upgrade starts here.
            </p>
          </div>
          <button className="text-link" onClick={onBrowse}>
            Shop all gadgets <ArrowUpRight size={16} />
          </button>
        </div>
        <div
          className="latest-tabs"
          role="tablist"
          aria-label="Explore the latest devices"
        >
          {latestDevices.map((item, index) => (
            <button
              key={item.id}
              ref={(element) => {
                tabs.current[index] = element;
              }}
              id={`latest-tab-${item.id}`}
              className={`latest-tab ${selected === index ? "is-active" : ""}`}
              type="button"
              role="tab"
              aria-label={item.name}
              aria-selected={selected === index}
              aria-controls={`latest-panel-${item.id}`}
              tabIndex={selected === index ? 0 : -1}
              onClick={() => setSelected(index)}
              onKeyDown={(event) => navigateTabs(event, index)}
            >
              <span>{item.maker}</span>
              <strong>{item.shortName}</strong>
              <ArrowUpRight size={16} />
            </button>
          ))}
        </div>
      </div>

      <div className={`latest-spotlight latest-spotlight-${device.id}`}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            className="latest-panel"
            id={`latest-panel-${device.id}`}
            role="tabpanel"
            aria-labelledby={`latest-tab-${device.id}`}
            key={device.id}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.22 }}
          >
            <div className="latest-visual" aria-hidden="true">
              <img src={device.image} alt="" loading="lazy" decoding="async" />
            </div>
            <div className="container latest-panel-inner">
              <motion.div
                className="latest-copy"
                initial={reduced ? false : { y: 14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.45, delay: 0.08 }}
              >
                <span className="eyebrow latest-edition">
                  <span />
                  {device.edition}
                </span>
                <h3>{device.name}</h3>
                <p className="latest-editorial-line">{device.headline}</p>
                <p className="latest-description">{device.description}</p>
                <div className="latest-actions">
                  <button
                    className="button button-red"
                    onClick={() => onExplore(device)}
                    aria-label={`Explore ${device.name}`}
                  >
                    Explore device <ArrowUpRight size={17} />
                  </button>
                  <a
                    className="latest-call"
                    href="tel:09138130976"
                    aria-label={`Call for ${device.name} availability`}
                  >
                    <Phone size={15} /> Check availability
                  </a>
                </div>
                <span className="latest-price-note">
                  {device.id === "macbook-pro-m6"
                    ? "Announced by Apple. Available from November 6, 2026."
                    : "Nigerian pricing and stock confirmed on enquiry."}
                </span>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="container latest-source-note">
        <span>Official product imagery. Never AI-generated by LEETECH.</span>
        <a href={device.sourceUrl} target="_blank" rel="noreferrer">
          View official product details <ArrowUpRight size={12} />
        </a>
      </div>
    </section>
  );
}

export function LatestDeviceDetails({ device }: { device: LatestDevice }) {
  const [finish, setFinish] = useState(device.finishes[0].name);
  const [configuration, setConfiguration] = useState(device.configurations[0]);
  const message = `Hello LEETECH & AUTOS, I would like to enquire about the ${device.name}. Preferred finish: ${finish}. Configuration: ${configuration}. Please confirm your Nigerian price, stock, SIM/region compatibility where applicable, and delivery options.`;

  return (
    <div className="latest-device-details">
      <div className="latest-detail-image">
        <img src={device.detailImage} alt={device.imageAlt} />
      </div>
      <div className="latest-detail-copy">
        <span className="eyebrow">
          {device.maker.toUpperCase()} / {device.category}
        </span>
        <h3>{device.name}</h3>
        <p className="latest-detail-description">{device.headline}</p>
        <span className="latest-price-on-request">Price on request</span>
        <div className="latest-detail-specs">
          {device.specs.map((spec) => (
            <p key={spec}>
              <Check size={14} />
              {spec}
            </p>
          ))}
        </div>
        <fieldset className="latest-finish-picker">
          <legend>
            Preferred finish <strong>{finish}</strong>
          </legend>
          <div>
            {device.finishes.map((item) => (
              <button
                className={finish === item.name ? "is-selected" : ""}
                type="button"
                key={item.name}
                onClick={() => setFinish(item.name)}
                aria-label={item.name}
                aria-pressed={finish === item.name}
                title={item.name}
              >
                <span style={{ background: item.hex }} />
              </button>
            ))}
          </div>
        </fieldset>
        <label className="latest-configuration">
          Preferred configuration
          <select
            value={configuration}
            onChange={(event) => setConfiguration(event.target.value)}
          >
            {device.configurations.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <p className="latest-release-note">{device.releaseNote}</p>
        <a
          className="button button-red latest-enquiry"
          href={`https://wa.me/2349138130976?text=${encodeURIComponent(message)}`}
          target="_blank"
          rel="noreferrer"
        >
          Enquire on WhatsApp <ArrowUpRight size={17} />
        </a>
        <div className="latest-detail-links">
          <a href="tel:09138130976">
            <Phone size={13} /> Call 09138130976
          </a>
          <a href={device.sourceUrl} target="_blank" rel="noreferrer">
            Official specifications <ArrowRight size={13} />
          </a>
        </div>
        <small className="latest-enquiry-note">
          An enquiry is not an order or payment. Images belong to {device.maker}
          ; LEETECH &amp; AUTOS is an independent business.
        </small>
      </div>
    </div>
  );
}
