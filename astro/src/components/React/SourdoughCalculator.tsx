import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface FlourType {
  id: string;
  name: string;
  amount: number;
}

interface SourdoughIngredients {
  flours: FlourType[];
  water: number;
  starter: number;
  salt: number;
}

interface SourdoughRatios {
  hydration: number; // water as % of flour
  starterRatio: number; // starter as % of flour
  saltRatio: number; // salt as % of flour
}

const DEFAULT_RATIOS: SourdoughRatios = {
  hydration: 75, // 75% hydration
  starterRatio: 20, // 20% starter
  saltRatio: 2, // 2% salt
};

const FLOUR_TYPES = [
  "All-Purpose Flour",
  "Bread Flour",
  "Whole Wheat",
  "Rye",
  "Spelt",
  "Einkorn",
  "Semolina",
  "Buckwheat",
  "Rice Flour",
  "Custom",
];

export default function SourdoughCalculator() {
  const [ratios, setRatios] = useState<SourdoughRatios>(DEFAULT_RATIOS);
  const [ingredients, setIngredients] = useState<SourdoughIngredients>({
    flours: [{ id: "1", name: "All-Purpose Flour", amount: 500 }],
    water: 350,
    starter: 100,
    salt: 10,
  });

  const getTotalFlour = () => {
    return ingredients.flours.reduce((sum, flour) => sum + flour.amount, 0);
  };

  const calculateOtherIngredients = (
    totalFlour: number,
    currentRatios: SourdoughRatios,
  ) => {
    return {
      water: Math.round(totalFlour * (currentRatios.hydration / 100)),
      starter: Math.round(totalFlour * (currentRatios.starterRatio / 100)),
      salt: Math.round(totalFlour * (currentRatios.saltRatio / 100) * 10) / 10,
    };
  };

  const updateFlourAmount = (id: string, newAmount: number) => {
    const updatedFlours = ingredients.flours.map((flour) =>
      flour.id === id ? { ...flour, amount: newAmount } : flour,
    );
    const totalFlour = updatedFlours.reduce(
      (sum, flour) => sum + flour.amount,
      0,
    );
    const otherIngredients = calculateOtherIngredients(totalFlour, ratios);

    setIngredients({
      flours: updatedFlours,
      ...otherIngredients,
    });
  };

  const updateFlourType = (id: string, newName: string) => {
    const updatedFlours = ingredients.flours.map((flour) =>
      flour.id === id ? { ...flour, name: newName } : flour,
    );
    setIngredients({ ...ingredients, flours: updatedFlours });
  };

  const addFlourType = () => {
    const newFlour: FlourType = {
      id: Date.now().toString(),
      name: "Bread Flour",
      amount: 100,
    };
    const updatedFlours = [...ingredients.flours, newFlour];
    const totalFlour = updatedFlours.reduce(
      (sum, flour) => sum + flour.amount,
      0,
    );
    const otherIngredients = calculateOtherIngredients(totalFlour, ratios);

    setIngredients({
      flours: updatedFlours,
      ...otherIngredients,
    });
  };

  const removeFlourType = (id: string) => {
    if (ingredients.flours.length <= 1) return; // Keep at least one flour
    const updatedFlours = ingredients.flours.filter((flour) => flour.id !== id);
    const totalFlour = updatedFlours.reduce(
      (sum, flour) => sum + flour.amount,
      0,
    );
    const otherIngredients = calculateOtherIngredients(totalFlour, ratios);

    setIngredients({
      flours: updatedFlours,
      ...otherIngredients,
    });
  };

  const updateFromWater = (newWater: number) => {
    const totalFlour = getTotalFlour();
    const newHydration = (newWater / totalFlour) * 100;
    const newRatios = { ...ratios, hydration: newHydration };
    setRatios(newRatios);
    setIngredients({ ...ingredients, water: newWater });
  };

  const updateFromHydration = (newHydration: number) => {
    const totalFlour = getTotalFlour();
    const newWater = Math.round(totalFlour * (newHydration / 100));
    const newRatios = { ...ratios, hydration: newHydration };
    setRatios(newRatios);
    setIngredients({ ...ingredients, water: newWater });
  };

  const updateFromStarter = (newStarter: number) => {
    const totalFlour = getTotalFlour();
    const newStarterRatio = (newStarter / totalFlour) * 100;
    const newRatios = { ...ratios, starterRatio: newStarterRatio };
    setRatios(newRatios);
    setIngredients({ ...ingredients, starter: newStarter });
  };

  const updateFromSalt = (newSalt: number) => {
    const totalFlour = getTotalFlour();
    const newSaltRatio = (newSalt / totalFlour) * 100;
    const newRatios = { ...ratios, saltRatio: newSaltRatio };
    setRatios(newRatios);
    setIngredients({ ...ingredients, salt: newSalt });
  };

  useEffect(() => {
    const totalFlour = getTotalFlour();
    const otherIngredients = calculateOtherIngredients(totalFlour, ratios);
    setIngredients((prev) => ({
      ...prev,
      ...otherIngredients,
    }));
  }, [ratios]);

  const totalWeight =
    getTotalFlour() +
    ingredients.water +
    ingredients.starter +
    ingredients.salt;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Calculator Card */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Ingredient Calculator</h2>
        </div>

        {/* Loaf Size Guide */}
        <div className="mb-6 rounded-lg border border-zinc-700 bg-zinc-900/50 p-4">
          <h3 className="mb-2 text-sm font-semibold text-zinc-200">
            Loaf Size Guide
          </h3>
          <div className="space-y-1 text-sm text-zinc-400">
            <div className="flex justify-between">
              <span>Small loaf (300g flour):</span>
              <span className="text-zinc-300">
                ~550g total dough, 8-9" diameter
              </span>
            </div>
            <div className="flex justify-between">
              <span>Medium loaf (500g flour):</span>
              <span className="text-zinc-300">
                ~900g total dough, 12" diameter
              </span>
            </div>
            <div className="flex justify-between">
              <span>Large loaf (750g flour):</span>
              <span className="text-zinc-300">
                ~1,350g total dough, 14-15" diameter
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Flour Types Section */}
          <div className="space-y-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-lg font-medium text-zinc-200">Flour Types</h3>
              <button
                onClick={addFlourType}
                className="rounded-lg bg-teal-600 px-3 py-2 text-sm font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400/20"
              >
                + Add Flour
              </button>
            </div>
            {ingredients.flours.map((flour, index) => (
              <div key={flour.id} className="grid gap-4 sm:grid-cols-3">
                <div className="flex flex-col space-y-2">
                  <label className="block text-sm font-medium text-zinc-300">
                    Flour Type
                  </label>
                  <select
                    value={flour.name}
                    onChange={(e) => updateFlourType(flour.id, e.target.value)}
                    className="grow w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20"
                  >
                    {FLOUR_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-zinc-300">
                    Amount (g)
                  </label>
                  <input
                    type="number"
                    value={flour.amount}
                    onChange={(e) =>
                      updateFlourAmount(flour.id, Number(e.target.value))
                    }
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20"
                    min="1"
                  />
                </div>

                <div className="flex items-end">
                  {ingredients.flours.length > 1 && (
                    <button
                      onClick={() => removeFlourType(flour.id)}
                      className="rounded-lg border border-red-600 bg-red-600/10 px-4 py-3 text-red-400 hover:bg-red-600/20 focus:outline-none focus:ring-2 focus:ring-red-400/20"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}

            <div className="rounded-lg bg-zinc-900/50 p-3">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-300">Total Flour:</span>
                <span className="font-semibold text-teal-200">
                  {getTotalFlour()}g
                </span>
              </div>
            </div>
          </div>

          {/* Other Ingredients */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-zinc-200">
              Other Ingredients
            </h3>

            {/* Water Section */}
            <div className="space-y-4">
              <h4 className="text-base font-medium text-zinc-300">Water</h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-zinc-300">
                    Water Amount (g)
                  </label>
                  <input
                    type="number"
                    value={ingredients.water}
                    onChange={(e) => updateFromWater(Number(e.target.value))}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20"
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-zinc-300">
                    Hydration (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={ratios.hydration.toFixed(1)}
                    onChange={(e) =>
                      updateFromHydration(Number(e.target.value))
                    }
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20"
                    min="0"
                    max="200"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {/* Starter Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-300">
                  Starter (g)
                </label>
                <input
                  type="number"
                  value={ingredients.starter}
                  onChange={(e) => updateFromStarter(Number(e.target.value))}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20"
                  min="0"
                />
                <p className="text-xs text-zinc-400">
                  {ratios.starterRatio.toFixed(1)}% of flour
                </p>
              </div>

              {/* Salt Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-300">
                  Salt (g)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={ingredients.salt}
                  onChange={(e) => updateFromSalt(Number(e.target.value))}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20"
                  min="0"
                />
                <p className="text-xs text-zinc-400">
                  {ratios.saltRatio.toFixed(1)}% of flour
                </p>
              </div>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="border-t border-zinc-800 pt-6">
            <h3 className="mb-3 text-sm font-medium text-zinc-300">
              Quick Presets
            </h3>
            <div className="grid gap-2 sm:grid-cols-3">
              <button
                onClick={() =>
                  setRatios({ hydration: 65, starterRatio: 15, saltRatio: 2 })
                }
                className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-left transition-colors hover:border-teal-400 hover:bg-zinc-800"
              >
                <div className="text-sm font-medium text-white">
                  Country Loaf
                </div>
                <div className="text-xs text-zinc-400">
                  65% hydration, 15% starter
                </div>
              </button>

              <button
                onClick={() =>
                  setRatios({ hydration: 75, starterRatio: 20, saltRatio: 2.2 })
                }
                className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-left transition-colors hover:border-teal-400 hover:bg-zinc-800"
              >
                <div className="text-sm font-medium text-white">
                  High Hydration
                </div>
                <div className="text-xs text-zinc-400">
                  75% hydration, 20% starter
                </div>
              </button>

              <button
                onClick={() =>
                  setRatios({ hydration: 80, starterRatio: 25, saltRatio: 2.5 })
                }
                className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-left transition-colors hover:border-teal-400 hover:bg-zinc-800"
              >
                <div className="text-sm font-medium text-white">
                  Ciabatta Style
                </div>
                <div className="text-xs text-zinc-400">
                  80% hydration, 25% starter
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recipe Instructions */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold">Recipe Summary</h2>

        <div className="mb-6 grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <h3 className="font-medium text-zinc-200">Ingredients</h3>
            <div className="space-y-2 text-base text-zinc-300">
              {ingredients.flours.map((flour) => (
                <div key={flour.id} className="flex justify-between">
                  <span>{flour.name}</span>
                  <span className="font-medium text-teal-200">
                    {flour.amount}g
                  </span>
                </div>
              ))}
              <div className="flex justify-between border-t border-zinc-700 pt-2">
                <span>Total Flour</span>
                <span className="font-medium text-teal-200">
                  {getTotalFlour()}g
                </span>
              </div>
              <div className="flex justify-between">
                <span>Water (lukewarm)</span>
                <span className="font-medium text-teal-200">
                  {ingredients.water}g
                </span>
              </div>
              <div className="flex justify-between">
                <span>Active starter</span>
                <span className="font-medium text-teal-200">
                  {ingredients.starter}g
                </span>
              </div>
              <div className="flex justify-between">
                <span>Salt</span>
                <span className="font-medium text-teal-200">
                  {ingredients.salt}g
                </span>
              </div>
              <div className="flex justify-between border-t border-zinc-700 pt-2 font-semibold">
                <span>Total dough weight</span>
                <span className="text-teal-200">{totalWeight}g</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium text-zinc-200">Ratios</h3>
            <div className="space-y-2 text-base text-zinc-300">
              <div className="flex justify-between">
                <span>Hydration</span>
                <span className="font-medium text-teal-200">
                  {ratios.hydration.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Starter</span>
                <span className="font-medium text-teal-200">
                  {ratios.starterRatio.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Salt</span>
                <span className="font-medium text-teal-200">
                  {ratios.saltRatio.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <h2 className="mb-4 text-xl font-semibold">Instructions</h2>
        <div className="space-y-4">
          {/* Mixing */}
          <div>
            <h4 className="mb-2 text-base font-semibold text-teal-400">
              Mixing & Autolyse
            </h4>
            <ol className="space-y-2 text-base text-zinc-300">
              <li className="flex gap-3">
                <span className="text-zinc-500">1.</span>
                <span>Combine all flours and blend thoroughly</span>
              </li>
              <li className="flex gap-3">
                <span className="text-zinc-500">2.</span>
                <span>Add lukewarm water and combine with bench scraper</span>
              </li>
              <li className="flex gap-3">
                <span className="text-zinc-500">3.</span>
                <span>Autolyse for 1 hour</span>
              </li>
              <li className="flex gap-3">
                <span className="text-zinc-500">4.</span>
                <span>
                  Add starter and combine using lobster claw pinching method
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-zinc-500">5.</span>
                <span>
                  Add salt and pour a splash of warm water over it. Combine
                  thoroughly
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-zinc-500">6.</span>
                <span>Cover with a damp towel and let sit for 10 minutes</span>
              </li>
              <li className="flex gap-3">
                <span className="text-zinc-500">7.</span>
                <span>
                  Mix by folding for 10 minutes or until you can form a gluten
                  window
                </span>
              </li>
            </ol>
          </div>

          {/* Bulk Ferment */}
          <div>
            <h4 className="mb-2 text-base font-semibold text-teal-400">
              Bulk Fermentation
            </h4>
            <ol className="space-y-2 text-base text-zinc-300" start={8}>
              <li className="flex gap-3">
                <span className="text-zinc-500">8.</span>
                <span>
                  Begin bulk ferment: cover with damp towel and let sit for 1
                  hour
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-zinc-500">9.</span>
                <span>
                  Fold gently every hour. Continue for 4-7 hours total or until
                  dough doubles in size and appears whipped
                </span>
              </li>
            </ol>
          </div>

          {/* Shaping */}
          <div>
            <h4 className="mb-2 text-base font-semibold text-teal-400">
              Pre-Shaping & Shaping
            </h4>
            <ol className="space-y-2 text-base text-zinc-300" start={10}>
              <li className="flex gap-3">
                <span className="text-zinc-500">10.</span>
                <span>
                  Dust surface with flour and allow the dough to pour itself out
                  from the bowl
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-zinc-500">11.</span>
                <span>
                  Cover the loaf with a damp towel and rest for 10 minutes
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-zinc-500">12.</span>
                <span>
                  Flip the loaf over and gently tug outwards, being sure to
                  retain bubbles
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-zinc-500">13.</span>
                <span>
                  Gently fold the sides in, pinching at the seam if necessary.
                  Then roll up like a jelly roll (or overstuffed burrito)
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-zinc-500">14.</span>
                <span>
                  Transfer to proofing basket, seam side up, using bench scraper
                </span>
              </li>
            </ol>
          </div>

          {/* Proofing */}
          <div>
            <h4 className="mb-2 text-base font-semibold text-teal-400">
              Cold Proof
            </h4>
            <ol className="space-y-2 text-base text-zinc-300" start={15}>
              <li className="flex gap-3">
                <span className="text-zinc-500">15.</span>
                <span>Cover with plastic and transfer to the refrigerator</span>
              </li>
              <li className="flex gap-3">
                <span className="text-zinc-500">16.</span>
                <span>Cold proof anywhere from 8-48 hours</span>
              </li>
            </ol>
          </div>

          {/* Baking */}
          <div>
            <h4 className="mb-2 text-base font-semibold text-teal-400">
              Baking
            </h4>
            <ol className="space-y-2 text-base text-zinc-300" start={17}>
              <li className="flex gap-3">
                <span className="text-zinc-500">17.</span>
                <span>When ready to bake, set oven to 500°F</span>
              </li>
              <li className="flex gap-3">
                <span className="text-zinc-500">18.</span>
                <span>Place dutch oven in the oven without the lid</span>
              </li>
              <li className="flex gap-3">
                <span className="text-zinc-500">19.</span>
                <span>
                  Once the oven has preheated, remove loaf from refrigerator
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-zinc-500">20.</span>
                <span>Flip the loaf onto parchment paper, seam side down</span>
              </li>
              <li className="flex gap-3">
                <span className="text-zinc-500">21.</span>
                <span>
                  Dust loaf with a fine layer of flour (preferably rice flour)
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-zinc-500">22.</span>
                <span>Score the loaf at a 30 degree angle</span>
              </li>
              <li className="flex gap-3">
                <span className="text-zinc-500">23.</span>
                <span>Transfer loaf to dutch oven and top with lid</span>
              </li>
              <li className="flex gap-3">
                <span className="text-zinc-500">24.</span>
                <span>Bake for 20 minutes</span>
              </li>
              <li className="flex gap-3">
                <span className="text-zinc-500">25.</span>
                <span>
                  After 20 minutes, lower the oven to 450°F and remove the lid
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-zinc-500">26.</span>
                <span>
                  Bake for another 30-40 minutes, or until desired color is
                  achieved
                </span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
