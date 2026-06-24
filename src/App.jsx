import { useMemo, useState } from "react";
import "./App.css";

const recipes = [
  {
    id: 1,
    name: "Garden Gin Spritz",
    spirit: "Gin",
    flavor: "Herbal",
    season: "Spring",
    complexity: "Easy",
    description:
      "A bright gin spritz with cucumber, mint, lemon, and sparkling water.",
  },
  {
    id: 2,
    name: "Smoky Paloma",
    spirit: "Tequila",
    flavor: "Smoky",
    season: "Summer",
    complexity: "Moderate",
    description:
      "A grapefruit-forward paloma with a smoky mezcal rinse and chili salt rim.",
  },
  {
    id: 3,
    name: "Spiced Maple Old Fashioned",
    spirit: "Whiskey",
    flavor: "Rich",
    season: "Fall",
    complexity: "Moderate",
    description:
      "A cozy whiskey cocktail with maple syrup, orange bitters, and warming spice.",
  },
  {
    id: 4,
    name: "Winter Citrus Mule",
    spirit: "Vodka",
    flavor: "Citrusy",
    season: "Winter",
    complexity: "Easy",
    description:
      "A crisp mule with vodka, blood orange, lime, ginger beer, and rosemary.",
  },
  {
    id: 5,
    name: "Zero-Proof Berry Fizz",
    spirit: "None",
    flavor: "Fruity",
    season: "Summer",
    complexity: "Easy",
    description:
      "A non-alcoholic berry and basil fizz with lemon and sparkling water.",
  },
  {
    id: 6,
    name: "Rum Pineapple Smash",
    spirit: "Rum",
    flavor: "Tropical",
    season: "Summer",
    complexity: "Easy",
    description:
      "A vacation-style rum cocktail with pineapple, lime, mint, and crushed ice.",
  },
  {
    id: 7,
    name: "Holiday Cranberry Negroni",
    spirit: "Gin",
    flavor: "Bitter",
    season: "Holiday",
    complexity: "Advanced",
    description:
      "A festive Negroni riff with cranberry, Campari, sweet vermouth, and orange.",
  },
  {
    id: 8,
    name: "Pear Vanilla Mocktail",
    spirit: "None",
    flavor: "Sweet",
    season: "Fall",
    complexity: "Moderate",
    description:
      "A layered zero-proof drink with pear nectar, vanilla, lemon, and soda.",
  },
];

const filterOptions = {
  spirit: ["All", "Gin", "Vodka", "Tequila", "Whiskey", "Rum", "None"],
  flavor: [
    "All",
    "Herbal",
    "Smoky",
    "Rich",
    "Citrusy",
    "Fruity",
    "Tropical",
    "Bitter",
    "Sweet",
  ],
  season: ["All", "Spring", "Summer", "Fall", "Winter", "Holiday"],
  complexity: ["All", "Easy", "Moderate", "Advanced"],
};

function App() {
  // Later, this will come from LaunchDarkly:
  // const showAiChat = flags["ai-recipe-chat"];
  const showAiChat = false;

  return (
    <main className="app">
      <header className="hero">
        <div>
          <p className="eyebrow">ABC Company Recipe Finder</p>
          <h1>Pour Decisions</h1>
          <p className="hero-copy">
            Find the right cocktail or mocktail for any moment. Browse by spirit, flavor profile, season, and complexity — or try
            the new AI recipe assistant when it is released.
          </p>
        </div>

        <div className="release-card">
          <span className="status-dot" />
          <div>
            <p className="release-label">Current experience</p>
            <strong>{showAiChat ? "AI Recipe Chat" : "Filterable Recipe List"}</strong>
          </div>
        </div>
      </header>

      {showAiChat ? <AIRecipeChat /> : <RecipeFilterList />}
    </main>
  );
}

function RecipeFilterList() {
  const [filters, setFilters] = useState({
    spirit: "All",
    flavor: "All",
    season: "All",
    complexity: "All",
  });

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      return (
        (filters.spirit === "All" || recipe.spirit === filters.spirit) &&
        (filters.flavor === "All" || recipe.flavor === filters.flavor) &&
        (filters.season === "All" || recipe.season === filters.season) &&
        (filters.complexity === "All" ||
          recipe.complexity === filters.complexity)
      );
    });
  }, [filters]);

  function updateFilter(filterName, value) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [filterName]: value,
    }));
  }

  function resetFilters() {
    setFilters({
      spirit: "All",
      flavor: "All",
      season: "All",
      complexity: "All",
    });
  }

  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Stable production experience</p>
          <h2>Recipe Library</h2>
        </div>
        <button className="secondary-button" onClick={resetFilters}>
          Reset filters
        </button>
      </div>

      <div className="filters">
        <FilterSelect
          label="Spirit"
          value={filters.spirit}
          options={filterOptions.spirit}
          onChange={(value) => updateFilter("spirit", value)}
        />

        <FilterSelect
          label="Flavor"
          value={filters.flavor}
          options={filterOptions.flavor}
          onChange={(value) => updateFilter("flavor", value)}
        />

        <FilterSelect
          label="Season"
          value={filters.season}
          options={filterOptions.season}
          onChange={(value) => updateFilter("season", value)}
        />

        <FilterSelect
          label="Complexity"
          value={filters.complexity}
          options={filterOptions.complexity}
          onChange={(value) => updateFilter("complexity", value)}
        />
      </div>

      <div className="results-summary">
        Showing {filteredRecipes.length} of {recipes.length} recipes
      </div>

      <div className="recipe-grid">
        {filteredRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>

      {filteredRecipes.length === 0 && (
        <div className="empty-state">
          No recipes match those filters. Try removing one filter.
        </div>
      )}
    </section>
  );
}

function FilterSelect({ label, value, options, onChange }) {
  return (
    <label className="filter-control">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function RecipeCard({ recipe }) {
  return (
    <article className="recipe-card">
      <div className="card-header">
        <h3>{recipe.name}</h3>
        <span className="pill">{recipe.complexity}</span>
      </div>

      <p>{recipe.description}</p>

      <div className="tags">
        <span>{recipe.spirit === "None" ? "No alcohol" : recipe.spirit}</span>
        <span>{recipe.flavor}</span>
        <span>{recipe.season}</span>
      </div>

      <button className="primary-button">View recipe</button>
    </article>
  );
}

function AIRecipeChat() {
  const [messages, setMessages] = useState([
    {
      sender: "assistant",
      text: "Tell me what you are in the mood for. For example: “something summery with gin, not too sweet.”",
    },
  ]);
  const [input, setInput] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (!input.trim()) return;

    const userMessage = {
      sender: "user",
      text: input,
    };

    const assistantMessage = {
      sender: "assistant",
      text: getMockRecommendation(input),
    };

    setMessages((currentMessages) => [
      ...currentMessages,
      userMessage,
      assistantMessage,
    ]);

    setInput("");
  }

  return (
    <section className="panel ai-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">New "AI"-powered experience</p>
          <h2>AI Recipe Chat</h2>
        </div>

        <span className="beta-badge">Beta</span>
      </div>

      <div className="chat-window">
        {messages.map((message, index) => (
          <div
            key={`${message.sender}-${index}`}
            className={`chat-message ${message.sender}`}
          >
            {message.text}
          </div>
        ))}
      </div>

      <form className="chat-form" onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask for a recipe recommendation..."
        />
        <button className="primary-button" type="submit">
          Send
        </button>
      </form>
    </section>
  );
}

function getMockRecommendation(prompt) {
  const normalizedPrompt = prompt.toLowerCase();

  if (normalizedPrompt.includes("gin")) {
    return "Try the Garden Gin Spritz. It is herbal, refreshing, and great for spring or summer.";
  }

  if (normalizedPrompt.includes("mocktail") || normalizedPrompt.includes("no alcohol")) {
    return "Try the Zero-Proof Berry Fizz. It is fruity, easy to make, and alcohol-free.";
  }

  if (normalizedPrompt.includes("fall") || normalizedPrompt.includes("cozy")) {
    return "Try the Spiced Maple Old Fashioned. It is rich, warming, and perfect for fall.";
  }

  if (normalizedPrompt.includes("tequila") || normalizedPrompt.includes("smoky")) {
    return "Try the Smoky Paloma. It has grapefruit, tequila, and a mezcal rinse.";
  }

  return "I recommend the Winter Citrus Mule. It is crisp, simple, and works well for a wide range of guests.";
}

export default App;