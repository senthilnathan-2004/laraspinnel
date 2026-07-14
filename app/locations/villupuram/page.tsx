import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Goat Farm & Fresh Mutton Delivery in Villupuram | Ragu Goat Farm",
  description:
    "Looking for a goat farm near Villupuram? Ragu Goat Farm offers healthy Tellicherry, Boer, and Naatu Aadu goats, plus bulk fresh mutton delivery in Villupuram.",
};

export default function VillupuramLocationPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-display uppercase text-brand-black tracking-tight sm:text-5xl">
          Villupuram's Trusted Goat Farm & Mutton Delivery
        </h1>
        <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
          Proudly serving Villupuram and surrounding districts with the healthiest live goats and farm-fresh mutton.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-6">Why Choose Ragu Goat Farm in Villupuram?</h2>
          <ul className="space-y-4 text-lg text-gray-700">
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span><strong>Local & Fresh:</strong> Located right here in Villupuram (604102), ensuring minimal transit stress for livestock and maximum freshness for mutton.</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span><strong>Variety of Breeds:</strong> We raise Tellicherry, Boer, and native Naatu Aadu perfectly acclimated to the Tamil Nadu climate.</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span><strong>Bulk Delivery:</strong> We handle bulk orders for weddings, festivals (Bakrid), and local restaurants across the Villupuram district.</span>
            </li>
          </ul>
        </div>
        <div className="bg-gray-50 p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-2xl font-bold mb-4">Visit Our Farm</h3>
          <p className="text-gray-600 mb-6">
            We encourage local buyers to visit us in person. Choose your goat directly from our herds.
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
