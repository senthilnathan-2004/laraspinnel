import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Handmade Crochet Gifts & Delivery in Villupuram | Lara's Pinnal",
  description:
    "Looking for handmade crochet gifts in Villupuram? Lara's Pinnal offers crochet flower bouquets, amigurumi plush, custom photo frames, keychains, and gift hampers, with delivery across Villupuram and India.",
};

export default function VillupuramLocationPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-2xl md:text-4xl font-display uppercase text-brand-black tracking-tight sm:text-5xl">
          Villupuram's Handmade Crochet Gift Studio
        </h1>
        <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto text-justify">
          Proudly serving Villupuram and surrounding districts with lovingly handcrafted crochet flowers, plush toys, and personalized gifts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Why Choose Lara's Pinnal in Villupuram?</h2>
          <ul className="space-y-4 text-lg text-gray-700">
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span className="text-justify"><strong>Local & Handmade:</strong> Crafted right here in Villupuram (604102), so you can support a local artisan studio and order with confidence.</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span className="text-justify"><strong>Variety of Gifts:</strong> Crochet flower bouquets, amigurumi plush toys, custom photo frames, cute keychains, and baby items, all hand-knitted with premium milk cotton yarn.</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span className="text-justify"><strong>Bulk & Custom Orders:</strong> We create gift hampers and bulk orders for weddings, birthdays, and corporate gifting across the Villupuram district and beyond.</span>
            </li>
          </ul>
        </div>
        <div className="bg-gray-50 p-5 md:p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-2xl font-bold mb-4">Visit Our Studio</h3>
          <p className="text-gray-600 mb-6 text-justify">
            We welcome local customers to reach out and personalize their crochet gifts directly with us.
          </p>
          <div className="space-y-3 text-gray-800">
            <p><strong>Address:</strong> 2/90 MettuStreet, Therkunam, Villupuram, Tamil Nadu - 604102</p>
            <p><strong>Hours:</strong> Mon - Sun, 06:00 AM - 08:00 PM</p>
            <p><strong>Phone:</strong> +91 9442379832</p>
          </div>
          <a
            href="/contact"
            className="mt-8 inline-block w-full text-center bg-brand-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors"
          >
            Get Directions
          </a>
        </div>
      </div>
    </main>
  );
}
