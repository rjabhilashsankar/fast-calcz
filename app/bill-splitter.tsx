"use client";

import { useState } from "react";

type Person = {
  id: string;
  name: string;
  items: LineItem[];
  sharedItems: string[]; // IDs of shared items
};

type LineItem = {
  id: string;
  name: string;
  price: string;
};

type SharedItem = {
  id: string;
  name: string;
  price: string;
  sharedBy: string[]; // Person IDs
};

export default function BillSplitter() {
  const [people, setPeople] = useState<Person[]>([
    { id: "1", name: "Person 1", items: [], sharedItems: [] }
  ]);
  const [sharedItems, setSharedItems] = useState<SharedItem[]>([]);
  const [tax, setTax] = useState("");
  const [taxType, setTaxType] = useState<"percent" | "amount">("amount");
  const [tip, setTip] = useState("");
  const [tipType, setTipType] = useState<"percent" | "amount">("amount");
  const [splitTipEqually, setSplitTipEqually] = useState(false);
  const [whoPaidId, setWhoPaidId] = useState<string>("");

  // Add person
  function addPerson() {
    const newId = (people.length + 1).toString();
    setPeople([...people, { id: newId, name: `Person ${newId}`, items: [], sharedItems: [] }]);
  }

  // Remove person
  function removePerson(personId: string) {
    if (people.length === 1) return;
    setPeople(people.filter(p => p.id !== personId));
    // Remove from shared items
    setSharedItems(sharedItems.map(item => ({
      ...item,
      sharedBy: item.sharedBy.filter(id => id !== personId)
    })));
    // Reset whoPaid if removed
    if (whoPaidId === personId) {
      setWhoPaidId("");
    }
  }

  // Update person name
  function updatePersonName(personId: string, name: string) {
    setPeople(people.map(p => p.id === personId ? { ...p, name } : p));
  }

  // Add item to person
  function addItemToPerson(personId: string) {
    setPeople(people.map(p => {
      if (p.id === personId) {
        const newItem: LineItem = { id: Date.now().toString(), name: "", price: "" };
        return { ...p, items: [...p.items, newItem] };
      }
      return p;
    }));
  }

  // Update person's item
  function updatePersonItem(personId: string, itemId: string, field: "name" | "price", value: string) {
    setPeople(people.map(p => {
      if (p.id === personId) {
        return {
          ...p,
          items: p.items.map(item => 
            item.id === itemId ? { ...item, [field]: value } : item
          )
        };
      }
      return p;
    }));
  }

  // Remove item from person
  function removePersonItem(personId: string, itemId: string) {
    setPeople(people.map(p => {
      if (p.id === personId) {
        return { ...p, items: p.items.filter(item => item.id !== itemId) };
      }
      return p;
    }));
  }

  // Add shared item
  function addSharedItem() {
    const newItem: SharedItem = {
      id: Date.now().toString(),
      name: "",
      price: "",
      sharedBy: people.map(p => p.id) // Default: shared by all
    };
    setSharedItems([...sharedItems, newItem]);
  }

  // Update shared item
  function updateSharedItem(itemId: string, field: "name" | "price", value: string) {
    setSharedItems(sharedItems.map(item =>
      item.id === itemId ? { ...item, [field]: value } : item
    ));
  }

  // Toggle person in shared item
  function togglePersonInSharedItem(itemId: string, personId: string) {
    setSharedItems(sharedItems.map(item => {
      if (item.id === itemId) {
        const isShared = item.sharedBy.includes(personId);
        return {
          ...item,
          sharedBy: isShared
            ? item.sharedBy.filter(id => id !== personId)
            : [...item.sharedBy, personId]
        };
      }
      return item;
    }));
  }

  // Remove shared item
  function removeSharedItem(itemId: string) {
    setSharedItems(sharedItems.filter(item => item.id !== itemId));
  }

  // Calculate totals
  const subtotal = [...people, ...sharedItems].reduce((sum, item) => {
    if ('items' in item) {
      // Person's individual items
      return sum + item.items.reduce((itemSum, lineItem) => 
        itemSum + (Number(lineItem.price) || 0), 0
      );
    } else {
      // Shared item
      return sum + (Number(item.price) || 0);
    }
  }, 0);

  const taxAmount = taxType === "percent" 
    ? (subtotal * (Number(tax) || 0)) / 100 
    : Number(tax) || 0;

  const subtotalWithTax = subtotal + taxAmount;

  const tipAmount = tipType === "percent"
    ? (subtotalWithTax * (Number(tip) || 0)) / 100
    : Number(tip) || 0;

  const grandTotal = subtotalWithTax + tipAmount;

  // Calculate per person
  const personTotals = people.map(person => {
    // Individual items
    const individualTotal = person.items.reduce((sum, item) => 
      sum + (Number(item.price) || 0), 0
    );

    // Shared items
    const sharedTotal = sharedItems.reduce((sum, item) => {
      if (item.sharedBy.includes(person.id) && item.sharedBy.length > 0) {
        return sum + (Number(item.price) || 0) / item.sharedBy.length;
      }
      return sum;
    }, 0);

    const personSubtotal = individualTotal + sharedTotal;
    
    // Tax proportional to their subtotal
    const personTax = subtotal > 0 ? (personSubtotal / subtotal) * taxAmount : 0;
    
    // Tip: either split equally or proportional
    let personTip = 0;
    if (splitTipEqually && people.length > 0) {
      personTip = tipAmount / people.length;
    } else {
      personTip = subtotalWithTax > 0 
        ? ((personSubtotal + personTax) / subtotalWithTax) * tipAmount 
        : 0;
    }

    const personTotal = personSubtotal + personTax + personTip;

    return {
      person,
      individualTotal,
      sharedTotal,
      personSubtotal,
      personTax,
      personTip,
      personTotal
    };
  });

  function shareResults() {
    let text = `Bill Split:\n`;
    
    if (whoPaidId) {
      const payer = people.find(p => p.id === whoPaidId);
      text += `${payer?.name} paid the bill\n\n`;
      text += `Payment Summary:\n`;
      personTotals
        .filter(({ person }) => person.id !== whoPaidId)
        .forEach(({ person, personTotal }) => {
          text += `${person.name} owes ${payer?.name}: ${personTotal.toFixed(2)}\n`;
        });
    } else {
      text += people.map((p, i) => {
        const pt = personTotals[i];
        return `${p.name}: ${pt.personTotal.toFixed(2)}`;
      }).join('\n');
    }
    
    text += `\nTotal: ${grandTotal.toFixed(2)}`;
    
    if (navigator.share) {
      navigator.share({ title: "Bill Split", text })
        .catch((error) => {
          if (error.name !== 'AbortError') console.error('Share failed:', error);
        });
    } else {
      navigator.clipboard.writeText(text);
      alert("📋 Copied to clipboard!");
    }
  }

  const hasResult = people.some(p => p.items.length > 0) || sharedItems.length > 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
        {/* Header */}
        <header className="mb-6 text-center max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 tracking-tight">
            Restaurant Bill Splitter
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Split bills fairly • Handle individual items, shared items, tax & tip
          </p>
        </header>

        <div className="grid lg:grid-cols-[1fr_360px] gap-4 sm:gap-6 items-start">
          {/* LEFT: Input */}
          <section className="space-y-4">
            {/* People Section */}
            <div className="bg-white rounded-xl p-4 sm:p-5 shadow-md border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-3">People & Individual Items</h2>
              
              {people.map((person, pIndex) => (
                <div key={person.id} className="mb-4 pb-4 border-b border-gray-200 last:border-0">
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="text"
                      value={person.name}
                      onChange={(e) => updatePersonName(person.id, e.target.value)}
                      placeholder="Name"
                      className="flex-1 px-3 py-2 text-sm font-semibold text-gray-900 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                    />
                    {people.length > 1 && (
                      <button
                        onClick={() => removePerson(person.id)}
                        className="px-3 py-2 bg-red-50 text-red-600 rounded-lg font-bold hover:bg-red-100 transition-all text-sm"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Person's items */}
                  {person.items.map((item) => (
                    <div key={item.id} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Item name"
                        value={item.name}
                        onChange={(e) => updatePersonItem(person.id, item.id, "name", e.target.value)}
                        className="flex-1 px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:border-indigo-500 outline-none"
                      />
                      <input
                        type="number"
                        placeholder="Price"
                        value={item.price}
                        onChange={(e) => updatePersonItem(person.id, item.id, "price", e.target.value)}
                        min="0"
                        step="0.01"
                        className="w-24 px-3 py-2 text-sm text-gray-900 font-semibold border border-gray-300 rounded-lg focus:border-indigo-500 outline-none"
                      />
                      <button
                        onClick={() => removePersonItem(person.id, item.id)}
                        className="px-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={() => addItemToPerson(person.id)}
                    className="text-sm text-indigo-600 font-semibold hover:text-indigo-700"
                  >
                    + Add item for {person.name}
                  </button>
                </div>
              ))}

              <button
                onClick={addPerson}
                className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all text-sm"
              >
                + Add Person
              </button>
            </div>

            {/* Shared Items Section */}
            <div className="bg-white rounded-xl p-4 sm:p-5 shadow-md border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Shared Items</h2>
              <p className="text-xs text-gray-600 mb-3">Items shared by multiple people (pizza, appetizers, drinks, etc.)</p>

              {sharedItems.map((item) => (
                <div key={item.id} className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Item name (e.g., Large Pizza)"
                      value={item.name}
                      onChange={(e) => updateSharedItem(item.id, "name", e.target.value)}
                      className="flex-1 px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:border-indigo-500 outline-none"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={item.price}
                      onChange={(e) => updateSharedItem(item.id, "price", e.target.value)}
                      min="0"
                      step="0.01"
                      className="w-24 px-3 py-2 text-sm text-gray-900 font-semibold border border-gray-300 rounded-lg focus:border-indigo-500 outline-none"
                    />
                    <button
                      onClick={() => removeSharedItem(item.id)}
                      className="px-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="text-xs text-gray-600 mb-1">Shared by:</div>
                  <div className="flex flex-wrap gap-2">
                    {people.map(person => (
                      <button
                        key={person.id}
                        onClick={() => togglePersonInSharedItem(item.id, person.id)}
                        className={`px-2 py-1 text-xs rounded-full font-semibold transition-all ${
                          item.sharedBy.includes(person.id)
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                        }`}
                      >
                        {person.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <button
                onClick={addSharedItem}
                className="w-full py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all text-sm"
              >
                + Add Shared Item
              </button>
            </div>

            {/* Tax & Tip Section */}
            <div className="bg-white rounded-xl p-4 sm:p-5 shadow-md border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Tax & Tip</h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tax</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="0"
                      value={tax}
                      onChange={(e) => setTax(e.target.value)}
                      min="0"
                      step="0.01"
                      className="flex-1 px-3 py-2 text-sm text-gray-900 font-semibold border-2 border-indigo-300 rounded-lg focus:border-indigo-500 outline-none"
                    />
                    <select
                      value={taxType}
                      onChange={(e) => setTaxType(e.target.value as "percent" | "amount")}
                      className="px-3 py-2 text-sm font-semibold text-gray-900 border-2 border-indigo-300 rounded-lg focus:border-indigo-500 outline-none bg-white"
                    >
                      <option value="amount">Amount</option>
                      <option value="percent">%</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tip</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="number"
                      placeholder="0"
                      value={tip}
                      onChange={(e) => setTip(e.target.value)}
                      min="0"
                      step="0.01"
                      className="flex-1 px-3 py-2 text-sm text-gray-900 font-semibold border-2 border-indigo-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-gray-400 placeholder:font-normal"
                    />
                    <select
                      value={tipType}
                      onChange={(e) => setTipType(e.target.value as "percent" | "amount")}
                      className="px-3 py-2 text-sm text-gray-900 font-semibold border-2 border-indigo-300 rounded-lg focus:border-indigo-500 outline-none bg-white"
                    >
                      <option value="amount">Amount</option>
                      <option value="percent">%</option>
                    </select>
                  </div>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={splitTipEqually}
                      onChange={(e) => setSplitTipEqually(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span>Split tip equally among all people {splitTipEqually ? '(Equal split)' : '(Proportional to bill)'}</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Who Paid Section */}
            <div className="bg-white rounded-xl p-4 sm:p-5 shadow-md border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Who Paid?</h2>
              <p className="text-xs text-gray-600 mb-3">Select who paid the bill to see who owes them money</p>
              
              <div className="flex flex-wrap gap-2">
                {people.map(person => (
                  <button
                    key={person.id}
                    onClick={() => setWhoPaidId(whoPaidId === person.id ? "" : person.id)}
                    className={`px-4 py-2 text-sm rounded-lg font-semibold transition-all ${
                      whoPaidId === person.id
                        ? "bg-green-600 text-white shadow-md"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {person.name}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* RIGHT: Results */}
          <aside className="lg:sticky lg:top-6">
            {hasResult ? (
              <>
                <div className="bg-white rounded-xl p-4 sm:p-5 shadow-lg border border-gray-200">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Grand Total
                  </div>
                  <div className="text-4xl sm:text-5xl font-bold text-indigo-600 mb-4">
                    {grandTotal.toFixed(2)}
                  </div>

                  <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold text-gray-900">{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-semibold text-gray-900">{taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tip</span>
                      <span className="font-semibold text-gray-900">{tipAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  {whoPaidId ? (
                    <>
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">
                        💸 Payment Summary
                      </h3>
                      <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
                        {personTotals
                          .filter(({ person }) => person.id !== whoPaidId)
                          .map(({ person, personTotal }) => (
                            <div key={person.id} className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="font-bold text-gray-900">{person.name}</div>
                                  <div className="text-xs text-gray-600">
                                    owes {people.find(p => p.id === whoPaidId)?.name}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-bold text-green-700 text-xl">
                                    {personTotal.toFixed(2)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">
                        Per Person Breakdown
                      </h3>

                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {personTotals.map(({ person, personTotal, personSubtotal, personTax, personTip }) => (
                          <div key={person.id} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-bold text-gray-900">{person.name}</span>
                              <span className="font-bold text-indigo-600 text-lg">{personTotal.toFixed(2)}</span>
                            </div>
                            <div className="space-y-1 text-xs text-gray-600">
                              <div className="flex justify-between">
                                <span>Items</span>
                                <span>{personSubtotal.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Tax</span>
                                <span>{personTax.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Tip</span>
                                <span>{personTip.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Share Button */}
                <button
                  onClick={shareResults}
                  className="mt-3 w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span>📤</span>
                  Share Result
                </button>
              </>
            ) : (
              <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-dashed border-gray-300 text-center">
                <div className="text-4xl mb-2">🍽️</div>
                <div className="text-gray-600 text-sm font-medium">
                  Add items to split the bill
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* SEO Content Below Calculator */}
        <div className="mt-12 space-y-8 bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              How to Use This Bill Splitter
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Our restaurant bill splitter makes it easy to divide bills fairly among friends, family, or colleagues. 
              Simply add each person's name, enter their individual items, and specify any shared items like appetizers 
              or pizzas. The calculator automatically splits shared items proportionally and calculates each person's 
              fair share including tax and tip.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Perfect for group dinners, restaurant outings, parties, team lunches, or any situation where you need 
              to split a bill fairly. Whether you're dining out with 2 people or 10, our calculator handles individual 
              orders, shared dishes, and ensures everyone pays exactly what they owe.
            </p>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Why Use Our Bill Splitter?
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
              <p><strong>Fair & Accurate:</strong> No more awkward math at the table. Split bills precisely based on what each person ordered.</p>
              <p><strong>Handle Shared Items:</strong> Easily split appetizers, pizzas, bottles of wine, or desserts among specific people who shared them.</p>
              <p><strong>Automatic Tax & Tip:</strong> Proportionally distribute tax and tip based on each person's share, or split tip equally if preferred.</p>
              <p><strong>Track Who Paid:</strong> Select who paid the bill to instantly see who owes them money and how much.</p>
              <p><strong>Share Results Easily:</strong> Send the split breakdown to your group via text, email, or social media with one tap.</p>
              <p><strong>No Registration Required:</strong> Start splitting bills immediately. No sign-up, no data collection, completely private.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Key Features
            </h2>
            <ul className="grid sm:grid-cols-2 gap-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Add unlimited people to split the bill</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Track individual items per person</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Handle shared items split among specific people</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Calculate tax as percentage or fixed amount</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Calculate tip as percentage or fixed amount</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Split tip equally or proportionally to bill</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>See detailed breakdown per person</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Track who paid and calculate who owes what</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Share results via text, email, or social media</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Mobile-friendly responsive design</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Real-time calculation as you type</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>100% free, no ads, works offline</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Common Use Cases
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-2">
<p><strong>Restaurant Dinners:</strong> Split the check fairly when dining out with friends or family, accounting for who ordered what and who shared appetizers.</p>
<p><strong>Group Travel:</strong> Divide meal costs during trips, vacations, or road trips where people order different items.</p>
<p><strong>Office Lunches:</strong> Split team lunch bills at work, especially when some colleagues order expensive items and others order light meals.</p>
<p><strong>Date Nights:</strong> Fairly split the bill on group dates or double dates where couples share items differently.</p>
<p><strong>Birthday Celebrations:</strong> Divide the cost when treating the birthday person, excluding their share from the split.</p>
<p><strong>Bar Tabs:</strong> Split drink bills fairly when some people had cocktails while others had beer or soft drinks.</p>
<p><strong>Food Delivery:</strong> Divide costs when ordering delivery for the office or a group, including delivery fees and tips.</p>
<p><strong>Potluck Contributions:</strong> Calculate fair contributions when some people bring food and others contribute money.</p>
</div>
</section><section>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          How Bill Splitting Works
        </h2>
        <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded mb-3">
          <p className="text-gray-800 font-semibold mb-2">Individual Items:</p>
          <p className="text-gray-800 text-sm">Each person pays for their own items plus their proportional share of tax and tip.</p>
          
          <p className="text-gray-800 font-semibold mt-3 mb-2">Shared Items:</p>
          <p className="text-gray-800 text-sm">Items like appetizers or pizzas are split equally among the people who shared them.</p>
          
          <p className="text-gray-800 font-semibold mt-3 mb-2">Tax Distribution:</p>
          <p className="text-gray-800 text-sm">Tax is distributed proportionally based on each person's subtotal (their items + shared items).</p>
          
          <p className="text-gray-800 font-semibold mt-3 mb-2">Tip Options:</p>
          <p className="text-gray-800 text-sm">Split tip equally among all people, or distribute it proportionally based on each person's bill.</p>
        </div>
        <p className="text-gray-700 leading-relaxed">
          For example, if three friends order: Person A gets a $15 burger, Person B gets a $25 steak, 
          and they share a $12 appetizer. Person A pays $15 + $6 (half the appetizer) = $21 subtotal, 
          while Person B pays $25 + $6 = $31 subtotal. Tax and tip are then added proportionally to 
          these amounts to ensure fairness.
        </p>
      </section>

      <section>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          Tips for Splitting Bills Fairly
        </h2>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-indigo-600 font-bold">1.</span>
            <span>Enter items as you order to avoid confusion later. Update prices when the bill arrives if needed.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-600 font-bold">2.</span>
            <span>Be clear about shared items upfront. Ask "Who wants to split this appetizer?" before ordering.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-600 font-bold">3.</span>
            <span>Use the "Who Paid?" feature if one person covers the bill, making it easy to settle up via Venmo, Cash App, or Zelle.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-600 font-bold">4.</span>
            <span>For large groups, consider asking the server to split checks by seat number to simplify tracking.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-600 font-bold">5.</span>
            <span>Round up slightly when settling to cover any small discrepancies or to add a bit extra for the person who paid upfront.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-600 font-bold">6.</span>
            <span>Share the breakdown with your group immediately so everyone knows what they owe while it's fresh in their minds.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-600 font-bold">7.</span>
            <span>Bookmark this tool on your phone for quick access during meals. It works offline once loaded.</span>
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          Tipping Guidelines
        </h2>
        <div className="text-gray-700 leading-relaxed space-y-2">
          <p><strong>Standard Tip (US):</strong> 15-20% for good service at restaurants, 20-25% for excellent service.</p>
          <p><strong>Casual Dining:</strong> 15-18% is typical for casual restaurants, cafes, and fast-casual establishments.</p>
          <p><strong>Fine Dining:</strong> 20-25% or more for upscale restaurants with exceptional service.</p>
          <p><strong>Bars & Pubs:</strong> $1-2 per drink, or 15-20% of the total tab.</p>
          <p><strong>Food Delivery:</strong> 15-20% of the order total, minimum $3-5 for small orders.</p>
          <p><strong>Large Groups:</strong> Some restaurants add automatic gratuity (18-20%) for parties of 6 or more.</p>
          <p className="text-sm italic">Note: Tipping customs vary by country and region. Adjust accordingly based on local standards.</p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-gray-900 mb-1">How do I split shared items among specific people?</h3>
            <p className="text-gray-700">Add a shared item, then click on the names of people who shared it. The cost will be divided equally among only those selected people, not the entire group.</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">Can I split tax and tip differently?</h3>
            <p className="text-gray-700">Yes! Tax is always split proportionally, but you can choose to split tip equally among all people or proportionally to each person's bill amount using the checkbox.</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">What if someone didn't order anything but shared items?</h3>
            <p className="text-gray-700">Simply don't add any individual items for that person. Only select them on the shared items they consumed, and they'll only pay for their share of those items plus proportional tax and tip.</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">How does the "Who Paid?" feature work?</h3>
            <p className="text-gray-700">Click on the person who paid the entire bill. The calculator will show how much each other person owes them, making it easy to collect payments via Venmo, Zelle, or cash.</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">Can I use this for non-restaurant bills?</h3>
            <p className="text-gray-700">Absolutely! Use it for any group expense: grocery shopping, office supplies, event tickets, vacation costs, or any shared purchase that needs to be split fairly.</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">Is my data saved or stored anywhere?</h3>
            <p className="text-gray-700">No, everything happens in your browser. We don't collect, store, or transmit any of your data. Your bill information is completely private and disappears when you close the page.</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">Does this work offline?</h3>
            <p className="text-gray-700">Yes! Once the page loads, it works completely offline. You can use it in restaurants without internet or when traveling abroad without data.</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">Can I split a bill with more than 10 people?</h3>
            <p className="text-gray-700">Yes, you can add as many people as needed. The calculator handles small groups and large parties equally well.</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">How accurate is the calculation?</h3>
            <p className="text-gray-700">The calculator uses precise decimal calculations to ensure accuracy down to the cent. The total of all individual shares will always equal the grand total exactly.</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          Bill Splitting Etiquette
        </h2>
        <div className="text-gray-700 leading-relaxed space-y-2">
          <p><strong>Discuss Before Ordering:</strong> If you're concerned about cost, mention splitting the bill fairly before ordering to set expectations.</p>
          <p><strong>Don't Order Excessively:</strong> If you know the bill will be split equally, be considerate and don't order the most expensive items unless others are doing the same.</p>
          <p><strong>Separate Checks Are OK:</strong> It's perfectly acceptable to ask for separate checks upfront if you prefer individual bills.</p>
          <p><strong>Treating Someone:</strong> If it's a birthday or celebration, discuss beforehand how the honored person's portion will be covered.</p>
          <p><strong>Alcohol Considerations:</strong> Non-drinkers shouldn't subsidize alcohol costs. Split alcoholic drinks separately or use individual items for drinks.</p>
          <p><strong>Payment Apps:</strong> Have Venmo, Zelle, or Cash App ready to settle up immediately rather than dealing with exact cash change.</p>
          <p><strong>Be Flexible:</strong> If someone is short a few dollars, don't make it awkward. Small differences can even out over multiple meals.</p>
        </div>
      </section>
    </div>
  </div>
</main>);
}