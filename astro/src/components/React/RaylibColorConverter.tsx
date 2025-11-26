import { useState } from "react";
import { motion } from "framer-motion";

type Language = "Odin" | "C" | "Zig" | "Go" | "Lua" | "C#" | "Python" | "Rust";

export default function RaylibColorConverter() {
  const [hexInput, setHexInput] = useState("#7817ff");
  const [copied, setCopied] = useState(false);
  const [language, setLanguage] = useState<Language>("Odin");
  const [opacity, setOpacity] = useState(255);
  const [variableName, setVariableName] = useState("");

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
        default:
          return "";
      }
    })();

    if (!variableName) return colorValue;

    switch (language) {
      case "Odin":
        return `${variableName} :: ${colorValue}`;
      case "C":
        return `#define ${variableName} ${colorValue}`;
      case "Zig":
        return `const ${variableName} = ${colorValue};`;
      case "Go":
        return `const ${variableName} = ${colorValue}`;
      case "Lua":
        return `local ${variableName} = ${colorValue}`;
      case "C#":
        return `public const Color ${variableName} = ${colorValue};`;
      case "Python":
        return `${variableName} = ${colorValue}`;
      case "Rust":
        return `const ${variableName}: Color = ${colorValue};`;
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Converter Card */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-lg">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">Hex to Raylib Color</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Convert hex color codes to Raylib color format for various languages
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
            </select>
          </div>

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

          {/* Raylib Output */}
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

      {/* Example Colors */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold">Example Colors</h2>
        <p className="mb-4 text-sm text-zinc-400">
          Click any color to use it in the converter
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { name: "Raylib Purple", hex: "#7817ff" },
            { name: "Raylib Red", hex: "#e62937" },
            { name: "Raylib Orange", hex: "#ff7700" },
            { name: "Raylib Yellow", hex: "#ffcc00" },
            { name: "Raylib Green", hex: "#00cc44" },
            { name: "Raylib Blue", hex: "#0088ff" },
          ].map((color) => {
            return (
              <button
                key={color.hex}
                onClick={() => {
                  setHexInput(color.hex);
                }}
                className="flex items-center gap-3 rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-left transition-colors hover:border-teal-400 hover:bg-zinc-800"
              >
                <div
                  className="h-10 w-10 rounded border border-zinc-700"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">
                    {color.name}
                  </div>
                  <div className="font-mono text-xs text-zinc-400">
                    {color.hex}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
