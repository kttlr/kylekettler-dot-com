import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const PALETTES_STORAGE_KEY = "raylib-color-palettes";

type Language =
  | "Odin"
  | "C"
  | "Zig"
  | "Go"
  | "Lua"
  | "C#"
  | "Python"
  | "Rust"
  | "Java"
  | "Ruby"
  | "Nim";

interface PaletteColor {
  id: string;
  hex: string;
  opacity: number;
  name: string;
}

interface SavedPalette {
  id: string;
  name: string;
  colors: PaletteColor[];
}

export default function RaylibColorConverter() {
  const [hexInput, setHexInput] = useState("#7817ff");
  const [copied, setCopied] = useState(false);
  const [language, setLanguage] = useState<Language>("Odin");
  const [opacity, setOpacity] = useState(255);
  const [variableName, setVariableName] = useState("");
  const [palette, setPalette] = useState<PaletteColor[]>([]);
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  const [paletteCopied, setPaletteCopied] = useState(false);
  const [paletteSaved, setPaletteSaved] = useState(false);
  const [savedPalettes, setSavedPalettes] = useState<SavedPalette[]>([]);
  const [currentPaletteId, setCurrentPaletteId] = useState<string | null>(null);
  const [paletteName, setPaletteName] = useState("");

  // Load saved palettes from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(PALETTES_STORAGE_KEY);
    if (stored) {
      try {
        setSavedPalettes(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse saved palettes:", e);
      }
    }
  }, []);

  const savePalette = () => {
    if (palette.length === 0) return;

    const name = paletteName.trim() || `Palette ${savedPalettes.length + 1}`;

    let updatedPalettes: SavedPalette[];

    if (currentPaletteId) {
      // Update existing palette
      updatedPalettes = savedPalettes.map((p) =>
        p.id === currentPaletteId ? { ...p, name, colors: palette } : p,
      );
    } else {
      // Create new palette
      const newPalette: SavedPalette = {
        id: Date.now().toString(),
        name,
        colors: palette,
      };
      updatedPalettes = [...savedPalettes, newPalette];
      setCurrentPaletteId(newPalette.id);
    }

    setSavedPalettes(updatedPalettes);
    localStorage.setItem(PALETTES_STORAGE_KEY, JSON.stringify(updatedPalettes));
    setPaletteSaved(true);
    setTimeout(() => setPaletteSaved(false), 2000);
  };

  const loadPalette = (savedPalette: SavedPalette) => {
    setPalette(savedPalette.colors);
    setCurrentPaletteId(savedPalette.id);
    setPaletteName(savedPalette.name);
    setSelectedColorId(null);
  };

  const deleteSavedPalette = (id: string) => {
    const paletteToDelete = savedPalettes.find((p) => p.id === id);
    if (!paletteToDelete) return;

    if (!window.confirm(`Delete "${paletteToDelete.name}"?`)) return;

    const updatedPalettes = savedPalettes.filter((p) => p.id !== id);
    setSavedPalettes(updatedPalettes);
    localStorage.setItem(PALETTES_STORAGE_KEY, JSON.stringify(updatedPalettes));

    if (currentPaletteId === id) {
      setCurrentPaletteId(null);
      setPaletteName("");
    }
  };

  const newPalette = () => {
    setPalette([]);
    setCurrentPaletteId(null);
    setPaletteName("");
    setSelectedColorId(null);
  };

  const hexToRgb = (
    hex: string,
  ): { r: number; g: number; b: number } | null => {
    const cleanHex = hex.replace(/^#/, "");

    if (!/^[0-9A-Fa-f]{6}$/.test(cleanHex)) {
      return null;
    }

    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);

    return { r, g, b };
  };

  const formatColor = (
    rgb: { r: number; g: number; b: number } | null,
  ): string => {
    if (!rgb) return "Invalid hex color";

    const colorValue = (() => {
      switch (language) {
        case "Odin":
          return `rl.Color{${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity}}`;
        case "C":
          return `(Color){ ${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity} }`;
        case "Zig":
          return `rl.Color{ .r = ${rgb.r}, .g = ${rgb.g}, .b = ${rgb.b}, .a = ${opacity} }`;
        case "Go":
          return `rl.NewColor(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
        case "Lua":
          return `{ r = ${rgb.r}, g = ${rgb.g}, b = ${rgb.b}, a = ${opacity} }`;
        case "C#":
          return `new Color(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
        case "Python":
          return `Color(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
        case "Rust":
          return `Color { r: ${rgb.r}, g: ${rgb.g}, b: ${rgb.b}, a: ${opacity} }`;
        case "Java":
          return `new Color(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
        case "Ruby":
          return `Color.new(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
        case "Nim":
          return `Color(r: ${rgb.r}, g: ${rgb.g}, b: ${rgb.b}, a: ${opacity})`;
        default:
          return "";
      }
    })();

    if (!variableName) return colorValue;

    // Replace spaces with underscores for valid variable names
    const safeName = variableName.replace(/\s+/g, "_");

    switch (language) {
      case "Odin":
        return `${safeName} :: ${colorValue}`;
      case "C":
        return `#define ${safeName} ${colorValue}`;
      case "Zig":
        return `const ${safeName} = ${colorValue};`;
      case "Go":
        return `const ${safeName} = ${colorValue}`;
      case "Lua":
        return `local ${safeName} = ${colorValue}`;
      case "C#":
        return `public const Color ${safeName} = ${colorValue};`;
      case "Python":
        return `${safeName} = ${colorValue}`;
      case "Rust":
        return `const ${safeName}: Color = ${colorValue};`;
      default:
        return colorValue;
    }
  };

  const rgb = hexToRgb(hexInput);
  const raylibColor = formatColor(rgb);

  const handleCopy = async () => {
    if (rgb) {
      await navigator.clipboard.writeText(raylibColor);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHexInput(e.target.value);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language);
  };

  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOpacity(Number(e.target.value));
  };

  const handleVariableNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVariableName(e.target.value);
  };

  const addToPalette = () => {
    if (!rgb) return;

    const newColor: PaletteColor = {
      id: Date.now().toString(),
      hex: hexInput.startsWith("#") ? hexInput : `#${hexInput}`,
      opacity: opacity,
      name: variableName || `Color ${palette.length + 1}`,
    };

    setPalette([...palette, newColor]);
  };

  const loadFromPalette = (color: PaletteColor) => {
    setHexInput(color.hex);
    setOpacity(color.opacity);
    setVariableName(color.name);
    setSelectedColorId(color.id);
  };

  const updatePaletteColor = () => {
    if (!selectedColorId || !rgb) return;

    setPalette(
      palette.map((color) =>
        color.id === selectedColorId
          ? {
              ...color,
              hex: hexInput.startsWith("#") ? hexInput : `#${hexInput}`,
              opacity: opacity,
              name: variableName || color.name,
            }
          : color,
      ),
    );
  };

  const removeFromPalette = (id: string) => {
    setPalette(palette.filter((color) => color.id !== id));
    if (selectedColorId === id) {
      setSelectedColorId(null);
    }
  };

  const formatPaletteColor = (color: PaletteColor): string => {
    const rgb = hexToRgb(color.hex);
    if (!rgb) return "";

    // Replace spaces with underscores for valid variable names
    const safeName = color.name.replace(/\s+/g, "_");

    const colorValue = (() => {
      switch (language) {
        case "Odin":
          return `rl.Color{${rgb.r}, ${rgb.g}, ${rgb.b}, ${color.opacity}}`;
        case "C":
          return `(Color){ ${rgb.r}, ${rgb.g}, ${rgb.b}, ${color.opacity} }`;
        case "Zig":
          return `rl.Color{ .r = ${rgb.r}, .g = ${rgb.g}, .b = ${rgb.b}, .a = ${color.opacity} }`;
        case "Go":
          return `rl.NewColor(${rgb.r}, ${rgb.g}, ${rgb.b}, ${color.opacity})`;
        case "Lua":
          return `{ r = ${rgb.r}, g = ${rgb.g}, b = ${rgb.b}, a = ${color.opacity} }`;
        case "C#":
          return `new Color(${rgb.r}, ${rgb.g}, ${rgb.b}, ${color.opacity})`;
        case "Python":
          return `Color(${rgb.r}, ${rgb.g}, ${rgb.b}, ${color.opacity})`;
        case "Rust":
          return `Color { r: ${rgb.r}, g: ${rgb.g}, b: ${rgb.b}, a: ${color.opacity} }`;
        case "Java":
          return `new Color(${rgb.r}, ${rgb.g}, ${rgb.b}, ${color.opacity})`;
        case "Ruby":
          return `Color.new(${rgb.r}, ${rgb.g}, ${rgb.b}, ${color.opacity})`;
        case "Nim":
          return `Color(r: ${rgb.r}, g: ${rgb.g}, b: ${rgb.b}, a: ${color.opacity})`;
        default:
          return "";
      }
    })();

    switch (language) {
      case "Odin":
        return `${safeName} :: ${colorValue}`;
      case "C":
        return `#define ${safeName} ${colorValue}`;
      case "Zig":
        return `const ${safeName} = ${colorValue};`;
      case "Go":
        return `const ${safeName} = ${colorValue}`;
      case "Lua":
        return `local ${safeName} = ${colorValue}`;
      case "C#":
        return `public const Color ${safeName} = ${colorValue};`;
      case "Python":
        return `${safeName} = ${colorValue}`;
      case "Rust":
        return `const ${safeName}: Color = ${colorValue};`;
      case "Java":
        return `public static final Color ${safeName} = ${colorValue};`;
      case "Ruby":
        return `${safeName} = ${colorValue}`;
      case "Nim":
        return `const ${safeName} = ${colorValue}`;
      default:
        return colorValue;
    }
  };

  const copyEntirePalette = async () => {
    if (palette.length === 0) return;

    const paletteCode = palette.map(formatPaletteColor).join("\n");
    await navigator.clipboard.writeText(paletteCode);
    setPaletteCopied(true);
    setTimeout(() => setPaletteCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 gap-6 items-start pt-24 p-12 md:grid-cols-2"
    >
      {/* Left Column - Color Selector and Palette */}
      <div className="space-y-6">
        {/* Color Selector */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-lg">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">Color Selector</h2>
            <p className="mt-2 text-sm text-zinc-400">
              Configure your hex color and opacity settings
            </p>
          </div>

          <div className="space-y-6">
            {/* Hex Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-300">
                Hex Color Code
              </label>
              <input
                type="text"
                value={hexInput}
                onChange={handleHexChange}
                placeholder="#7817ff"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 font-mono text-white focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20"
              />
              <p className="text-xs text-zinc-400">
                Enter a 6-digit hex color code (with or without #)
              </p>
            </div>

            {/* Variable Name Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-300">
                Constant Name
              </label>
              <input
                type="text"
                value={variableName}
                onChange={handleVariableNameChange}
                placeholder="Constant name"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 font-mono text-white focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20"
              />
              <p className="text-xs text-zinc-400">
                Enter a name to generate a constant declaration
              </p>
            </div>

            {/* Opacity Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-zinc-300">
                  Opacity
                </label>
                <span className="text-sm font-semibold text-teal-200">
                  {opacity}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="255"
                value={opacity}
                onChange={handleOpacityChange}
                className="w-full"
              />
            </div>

            {/* Color Preview with RGBA Values */}
            {rgb && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-300">
                  Color Preview
                </label>
                <div
                  className="relative flex items-center justify-center rounded-lg border border-zinc-700 px-6 py-10"
                  style={{
                    backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity / 255})`,
                  }}
                >
                  <div className="flex items-center rounded-lg bg-black/30 px-4 py-2 backdrop-blur-sm">
                    <div className="flex items-center gap-4 text-center">
                      <div>
                        <div className="text-xs mb-1 text-white/80">Red</div>
                        <div className="text-lg font-semibold text-white">
                          {rgb.r}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs mb-1 text-white/80">Green</div>
                        <div className="text-lg font-semibold text-white">
                          {rgb.g}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs mb-1 text-white/80">Blue</div>
                        <div className="text-lg font-semibold text-white">
                          {rgb.b}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs mb-1 text-white/80">Alpha</div>
                        <div className="text-lg font-semibold text-white">
                          {opacity}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Palette Actions */}
            {rgb && (
              <div className="flex gap-3">
                {selectedColorId ? (
                  <>
                    <button
                      onClick={updatePaletteColor}
                      className="flex-1 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400/20"
                    >
                      Update in Palette
                    </button>
                    <button
                      onClick={() => {
                        setSelectedColorId(null);
                        setHexInput("#7817ff");
                        setOpacity(255);
                        setVariableName("");
                      }}
                      className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400/20"
                    >
                      New Color
                    </button>
                  </>
                ) : (
                  <button
                    onClick={addToPalette}
                    className="flex-1 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400/20"
                  >
                    Add to Palette
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Color Palette */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-lg">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Color Palette</h2>
            <p className="mt-1 text-sm text-zinc-400">
              {palette.length === 0
                ? "Your saved colors will appear here. Create a color and add it to your palette."
                : "Click a color to edit it, or remove colors you no longer need."}
            </p>
          </div>

          {/* Palette Name Input */}
          <div className="mb-4 space-y-2">
            <label className="block text-sm font-medium text-zinc-300">
              Palette Name
            </label>
            <input
              type="text"
              value={paletteName}
              onChange={(e) => setPaletteName(e.target.value)}
              placeholder="My Palette"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-white focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20"
            />
          </div>

          {palette.length === 0 ? (
            <div className="rounded-lg border border-zinc-700 border-dashed bg-zinc-900/50 p-8 text-center">
              <p className="text-sm text-zinc-500">No colors in palette yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Color Grid */}
              <div className="grid gap-3 sm:grid-cols-2">
                {palette.map((color) => {
                  const rgb = hexToRgb(color.hex);
                  const isSelected = selectedColorId === color.id;
                  return (
                    <div
                      key={color.id}
                      className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
                        isSelected
                          ? "border-teal-400 bg-zinc-800"
                          : "border-zinc-700 bg-zinc-900"
                      }`}
                    >
                      <button
                        onClick={() => loadFromPalette(color)}
                        className="flex flex-1 items-center gap-3 text-left"
                      >
                        <div
                          className="h-10 w-10 flex-shrink-0 rounded border border-zinc-700"
                          style={{
                            backgroundColor: `rgba(${rgb?.r}, ${rgb?.g}, ${rgb?.b}, ${color.opacity / 255})`,
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-white truncate">
                            {color.name}
                          </div>
                          <div className="font-mono text-xs text-zinc-400">
                            {color.hex} · α{color.opacity}
                          </div>
                        </div>
                      </button>
                      <button
                        onClick={() => removeFromPalette(color.id)}
                        className="flex-shrink-0 rounded p-1.5 text-zinc-400 transition-colors hover:bg-red-600/10 hover:text-red-400"
                        title="Remove color"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Save/New Palette Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={savePalette}
                  className="flex-1 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400/20"
                >
                  {paletteSaved
                    ? "Saved!"
                    : currentPaletteId
                      ? "Update Palette"
                      : "Save Palette"}
                </button>
                <button
                  onClick={newPalette}
                  className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400/20"
                >
                  New Palette
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Saved Palettes */}
        {savedPalettes.length > 0 && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-lg">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Saved Palettes</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Click a palette to load it.
              </p>
            </div>
            <div className="space-y-2">
              {savedPalettes.map((saved) => (
                <div
                  key={saved.id}
                  className={`flex items-center justify-between rounded-lg border p-3 transition-colors ${
                    currentPaletteId === saved.id
                      ? "border-teal-400 bg-zinc-800"
                      : "border-zinc-700 bg-zinc-900"
                  }`}
                >
                  <button
                    onClick={() => loadPalette(saved)}
                    className="flex flex-1 items-center gap-3 text-left"
                  >
                    <div className="flex -space-x-1">
                      {saved.colors.slice(0, 5).map((color) => {
                        const rgb = hexToRgb(color.hex);
                        return (
                          <div
                            key={color.id}
                            className="h-6 w-6 rounded-full border border-zinc-700"
                            style={{
                              backgroundColor: `rgba(${rgb?.r}, ${rgb?.g}, ${rgb?.b}, ${color.opacity / 255})`,
                            }}
                          />
                        );
                      })}
                      {saved.colors.length > 5 && (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-xs text-zinc-400">
                          +{saved.colors.length - 5}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">
                        {saved.name}
                      </div>
                      <div className="text-xs text-zinc-400">
                        {saved.colors.length} color
                        {saved.colors.length !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => deleteSavedPalette(saved.id)}
                    className="flex-shrink-0 rounded p-1.5 text-zinc-400 transition-colors hover:bg-red-600/10 hover:text-red-400"
                    title="Delete palette"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Column - Code Output */}
      <div className="space-y-6">
        {/* Code Output */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-lg">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">Code Output</h2>
            <p className="mt-2 text-sm text-zinc-400">
              Generate Raylib color code in various languages
            </p>
          </div>

          <div className="space-y-6">
            {/* Language Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-300">
                Language
              </label>
              <select
                value={language}
                onChange={handleLanguageChange}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20"
              >
                <option value="Odin">Odin</option>
                <option value="C">C</option>
                <option value="Zig">Zig</option>
                <option value="Go">Go</option>
                <option value="Lua">Lua</option>
                <option value="C#">C#</option>
                <option value="Python">Python</option>
                <option value="Rust">Rust</option>
                <option value="Java">Java</option>
                <option value="Ruby">Ruby</option>
                <option value="Nim">Nim</option>
              </select>
            </div>

            {/* Single Color Output */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-300">
                Raylib Color ({language})
              </label>
              <div className="relative">
                <div className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 pr-20 font-mono text-white">
                  {raylibColor}
                </div>
                {rgb && (
                  <button
                    onClick={handleCopy}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-teal-600 px-3 py-1.5 text-sm font-medium text-white transition-all hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400/20"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                )}
              </div>
              {!rgb && (
                <p className="text-xs text-red-400">
                  Please enter a valid 6-digit hex color code
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Palette Code Preview */}
        {palette.length > 0 && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-lg">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Palette Code</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Copy all your palette colors as code in {language} format.
              </p>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-300">
                Generated Code ({language})
              </label>
              <div className="relative">
                <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-4 pr-24">
                  <pre className="overflow-x-auto font-mono text-sm text-white">
                    {palette
                      .map((color) => formatPaletteColor(color))
                      .join("\n")}
                  </pre>
                </div>
                <button
                  onClick={copyEntirePalette}
                  className="absolute right-2 top-2 rounded-lg bg-teal-600 px-3 py-1.5 text-sm font-medium text-white transition-all hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400/20"
                >
                  {paletteCopied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
