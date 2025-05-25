import React, { useState, useEffect, useCallback } from "react";
import {
  PlusCircle,
  Edit3,
  Trash2,
  Users,
  CalendarDays,
  Clock,
  Filter,
  LogIn,
  LogOut,
  Copy,
  UserPlus,
  Send,
  ClipboardCopy,
} from "lucide-react"; // Added ClipboardCopy

// Placeholder for Firebase Configuration
// Create a file named firebaseConfig.js in your src directory
// and add your Firebase project configuration there.
/*
// Example firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
*/

// Mock Data (replace with Firebase calls)
const initialOpportunities = [
  {
    id: "1",
    title: "Spring Regatta Setup",
    description:
      "Help set up for the annual spring regatta. Tasks include boat preparation, course marking, and site setup.",
    date: "2025-06-15", // YYYY-MM-DD
    endDate: null,
    timeOfDay: "Morning", // 'Morning', 'Afternoon', 'Evening', 'All Day'
    timeRange: "08:00 - 12:00",
    volunteersNeeded: 10,
    volunteersSignedUp: [
      {
        name: "Alice Smith",
        email: "alice@example.com",
        phone: "555-1234",
        signupDate: "2025-05-10T10:00:00Z",
      },
    ],
    createdAt: new Date("2025-05-01T10:00:00Z").toISOString(),
  },
  {
    id: "2",
    title: "Youth Sailing Camp Assistant",
    description:
      "Assist instructors during the youth summer sailing camp. Must be good with kids.",
    date: "2025-07-20",
    endDate: "2025-07-25", // Date range example
    timeOfDay: "All Day",
    timeRange: "09:00 - 17:00",
    volunteersNeeded: 5,
    volunteersSignedUp: [
      {
        name: "Bob Johnson",
        email: "bob@example.com",
        phone: "555-5678",
        signupDate: "2025-05-11T11:00:00Z",
      },
      {
        name: "Carol Williams",
        email: "carol@example.com",
        phone: "555-8765",
        signupDate: "2025-05-12T12:00:00Z",
      },
    ],
    createdAt: new Date("2025-05-10T10:00:00Z").toISOString(),
  },
  {
    id: "3",
    title: "Clubhouse Maintenance Day",
    description:
      "General maintenance and cleanup of the clubhouse and grounds.",
    date: "2025-06-01",
    endDate: null,
    timeOfDay: "Afternoon",
    timeRange: "13:00 - 17:00",
    volunteersNeeded: 8,
    volunteersSignedUp: [],
    createdAt: new Date("2025-04-20T10:00:00Z").toISOString(),
  },
  {
    id: "4",
    title: "Race Committee Boat Crew",
    description:
      "Join the race committee boat for weekend races. Experience preferred but not required.",
    date: "2025-08-03",
    endDate: null,
    timeOfDay: "Full Day",
    timeRange: "10:00 - 18:00",
    volunteersNeeded: 3,
    volunteersSignedUp: [
      {
        name: "David Brown",
        email: "david@example.com",
        phone: "555-4321",
        signupDate: "2025-05-16T14:00:00Z",
      },
    ],
    createdAt: new Date("2025-05-15T10:00:00Z").toISOString(),
  },
];

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString + "T00:00:00").toLocaleDateString(
    undefined,
    options
  ); // Ensure date is parsed as local
};

// Helper function to get today's date in YYYY-MM-DD format
const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Main App Component
function App() {
  const [isManagerMode, setIsManagerMode] = useState(false);
  // const [currentUser, setCurrentUser] = useState(null); // For Firebase Auth
  const [opportunities, setOpportunities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("nearest"); // 'nearest', 'dateAsc', 'dateDesc'

  // TODO: Replace with Firebase Auth state listener
  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged(user => {
  //     setCurrentUser(user);
  //     setIsManagerMode(!!user); // Automatically enter manager mode if logged in
  //     setIsLoading(false);
  //   });
  //   return () => unsubscribe();
  // }, []);

  // Fetch opportunities (TODO: Replace with Firebase Firestore call)
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      try {
        // Filter out past opportunities for "nearest" sort, or handle as needed
        // For manager mode, show all opportunities regardless of date for management purposes.
        // For public view, only show upcoming.
        const relevantOpportunities = isManagerMode
          ? initialOpportunities
          : initialOpportunities.filter((op) => {
              const opDate = new Date(op.endDate || op.date);
              return opDate >= new Date(getTodayDateString());
            });

        let sortedOpportunities = [...relevantOpportunities];
        if (sortOption === "nearest" || sortOption === "dateAsc") {
          // For 'nearest', ensure future dates are prioritized.
          // If showing all dates (manager mode), this sort will still put earlier dates first.
          sortedOpportunities.sort(
            (a, b) => new Date(a.date) - new Date(b.date)
          );
          if (sortOption === "nearest" && !isManagerMode) {
            // Further refine 'nearest' for public: filter out past, then sort by date
            sortedOpportunities = sortedOpportunities.filter(
              (op) =>
                new Date(op.endDate || op.date) >=
                new Date(getTodayDateString())
            );
          }
        } else if (sortOption === "dateDesc") {
          sortedOpportunities.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
        }
        setOpportunities(sortedOpportunities);
        setError(null);
      } catch (err) {
        console.error("Error processing opportunities:", err);
        setError("Failed to load opportunities.");
        setOpportunities([]);
      }
      setIsLoading(false);
    }, 1000);
  }, [sortOption, isManagerMode]); // Added isManagerMode dependency

  const handleLogin = () => {
    // TODO: Implement Firebase Login
    setIsManagerMode(true);
    alert("Login functionality to be implemented with Firebase.");
  };

  const handleLogout = () => {
    // TODO: Implement Firebase Logout
    setIsManagerMode(false);
  };

  // CRUD Operations for Opportunities (placeholders for Firebase)
  const addOpportunity = (newOpportunity) => {
    // TODO: Implement Firebase addDoc
    const newOpWithId = {
      ...newOpportunity,
      id: Date.now().toString(),
      volunteersSignedUp: [],
      createdAt: new Date().toISOString(),
    };
    setOpportunities((prevOps) => {
      const updatedOps = [...prevOps, newOpWithId];
      // Re-apply sort based on current sortOption
      if (sortOption === "nearest" || sortOption === "dateAsc") {
        return updatedOps.sort((a, b) => new Date(a.date) - new Date(b.date));
      } else if (sortOption === "dateDesc") {
        return updatedOps.sort((a, b) => new Date(b.date) - new Date(a.date));
      }
      return updatedOps;
    });
    alert("Opportunity added (mock). Implement Firebase save.");
  };

  const updateOpportunity = (updatedOpportunity) => {
    // TODO: Implement Firebase updateDoc
    setOpportunities((prevOps) =>
      prevOps.map((op) =>
        op.id === updatedOpportunity.id ? updatedOpportunity : op
      )
    );
    alert("Opportunity updated (mock). Implement Firebase save.");
  };

  const deleteOpportunity = (opportunityId) => {
    // TODO: Implement Firebase deleteDoc
    if (window.confirm("Are you sure you want to delete this opportunity?")) {
      setOpportunities((prevOps) =>
        prevOps.filter((op) => op.id !== opportunityId)
      );
      alert("Opportunity deleted (mock). Implement Firebase delete.");
    }
  };

  const duplicateOpportunity = (opportunityId) => {
    const originalOp = opportunities.find((op) => op.id === opportunityId);
    if (originalOp) {
      const newTitle = `${originalOp.title} (Copy)`;
      const newDate = getTodayDateString();
      const duplicatedOp = {
        ...originalOp,
        id: Date.now().toString(),
        title: newTitle,
        date: newDate,
        endDate: null,
        volunteersSignedUp: [],
        createdAt: new Date().toISOString(),
      };
      addOpportunity(duplicatedOp);
      alert(
        `Opportunity "${originalOp.title}" duplicated as "${newTitle}". Update details as needed.`
      );
    }
  };

  const handleVolunteerSignup = (opportunityId, signupData) => {
    // TODO: Implement Firebase addDoc to 'opportunities/{opportunityId}/signups'
    setOpportunities((prevOps) =>
      prevOps.map((op) => {
        if (op.id === opportunityId) {
          const alreadySignedUp = op.volunteersSignedUp.find(
            (v) => v.email === signupData.email
          );
          if (alreadySignedUp) {
            alert(
              "You have already signed up for this opportunity with this email."
            );
            return op;
          }
          if (op.volunteersSignedUp.length >= op.volunteersNeeded) {
            alert("Sorry, this opportunity is already full.");
            return op;
          }
          return {
            ...op,
            volunteersSignedUp: [...op.volunteersSignedUp, signupData],
          };
        }
        return op;
      })
    );
    alert(
      `Signed up for opportunity (mock). Implement Firebase save for ${signupData.name}.`
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-600 to-cyan-400 text-gray-800 font-sans">
      <Navbar
        isManagerMode={isManagerMode}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
      <main className="container mx-auto p-4 pt-20">
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            {error}
          </div>
        )}

        <div className="my-6 flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-4xl font-bold text-white mb-4 sm:mb-0">
            Volunteer Opportunities
          </h1>
          <div className="flex items-center space-x-2 bg-white/30 backdrop-blur-md p-3 rounded-lg shadow">
            <Filter size={20} className="text-sky-700" />
            <label
              htmlFor="sortOption"
              className="text-sm font-medium text-sky-800"
            >
              Sort by:
            </label>
            <select
              id="sortOption"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 p-2"
            >
              <option value="nearest">Nearest to Today (Upcoming)</option>
              <option value="dateAsc">Date (Oldest First)</option>
              <option value="dateDesc">Date (Newest First)</option>
            </select>
          </div>
        </div>

        {isManagerMode ? (
          <AdminPanel
            opportunities={opportunities} // Will show all opportunities for manager
            onAddOpportunity={addOpportunity}
            onUpdateOpportunity={updateOpportunity}
            onDeleteOpportunity={deleteOpportunity}
            onDuplicateOpportunity={duplicateOpportunity}
          />
        ) : (
          <PublicDisplay
            opportunities={opportunities.filter(
              (op) =>
                new Date(op.endDate || op.date) >=
                new Date(getTodayDateString())
            )} // Public only sees upcoming
            onSignup={handleVolunteerSignup}
          />
        )}
      </main>
      <footer className="text-center p-6 mt-12 text-white/80 text-sm">
        <p>
          &copy; {new Date().getFullYear()} Sailing School Volunteers. All
          rights reserved.
        </p>
        <p>Powered by Good Intentions & Future Firebase</p>
      </footer>
    </div>
  );
}

// Navigation Bar Component
function Navbar({ isManagerMode, onLogin, onLogout }) {
  return (
    <nav className="bg-sky-700/80 backdrop-blur-md text-white p-4 shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold">Sailing School Volunteers</div>
        <button
          onClick={isManagerMode ? onLogout : onLogin}
          className="bg-white text-sky-700 hover:bg-sky-100 font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out flex items-center space-x-2"
        >
          {isManagerMode ? <LogOut size={18} /> : <LogIn size={18} />}
          <span>{isManagerMode ? "Logout Manager" : "Manager Login"}</span>
        </button>
      </div>
    </nav>
  );
}

// Public Display of Opportunities
function PublicDisplay({ opportunities, onSignup }) {
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  const handleSignupClick = (opportunity) => {
    if (opportunity.volunteersSignedUp.length >= opportunity.volunteersNeeded) {
      alert("This opportunity is full. Thank you for your interest!");
      return;
    }
    setSelectedOpportunity(opportunity);
    setShowSignupModal(true);
  };

  const handleModalClose = () => {
    setShowSignupModal(false);
    setSelectedOpportunity(null);
  };

  const handleFormSubmit = (signupData) => {
    onSignup(selectedOpportunity.id, signupData);
    handleModalClose();
  };

  // Opportunities are pre-filtered for upcoming in App component for PublicDisplay
  if (opportunities.length === 0) {
    return (
      <div className="text-center py-10 text-xl text-white bg-black/20 rounded-lg shadow-xl">
        No upcoming volunteer opportunities available at the moment. Please
        check back later!
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {opportunities.map((op) => (
        <OpportunityCard
          key={op.id}
          opportunity={op}
          onSignupClick={handleSignupClick}
          isManagerView={false}
        />
      ))}
      {showSignupModal && selectedOpportunity && (
        <SignupModal
          opportunity={selectedOpportunity}
          onClose={handleModalClose}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
}

// Admin Panel Component
function AdminPanel({
  opportunities,
  onAddOpportunity,
  onUpdateOpportunity,
  onDeleteOpportunity,
  onDuplicateOpportunity,
}) {
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState(null);
  const [showVolunteerListModal, setShowVolunteerListModal] = useState(false);
  const [
    selectedOpportunityForVolunteers,
    setSelectedOpportunityForVolunteers,
  ] = useState(null);

  const handleAddNew = () => {
    setEditingOpportunity(null);
    setShowFormModal(true);
  };

  const handleEdit = (opportunity) => {
    setEditingOpportunity(opportunity);
    setShowFormModal(true);
  };

  const handleFormSave = (opportunityData) => {
    if (editingOpportunity) {
      onUpdateOpportunity({ ...editingOpportunity, ...opportunityData });
    } else {
      onAddOpportunity(opportunityData);
    }
    setShowFormModal(false);
    setEditingOpportunity(null);
  };

  const handleOpenVolunteerList = (opportunity) => {
    setSelectedOpportunityForVolunteers(opportunity);
    setShowVolunteerListModal(true);
  };

  const handleCloseVolunteerList = () => {
    setShowVolunteerListModal(false);
    setSelectedOpportunityForVolunteers(null);
  };

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <button
          onClick={handleAddNew}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-150 ease-in-out flex items-center space-x-2 text-lg"
        >
          <PlusCircle size={24} />
          <span>Add New Opportunity</span>
        </button>
      </div>
      {opportunities.length === 0 ? (
        <div className="text-center py-10 text-xl text-white bg-black/20 rounded-lg shadow-xl">
          No opportunities found. Click "Add New Opportunity" to create one.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map((op) => (
            <OpportunityCard
              key={op.id}
              opportunity={op}
              onEdit={() => handleEdit(op)}
              onDelete={() => onDeleteOpportunity(op.id)}
              onDuplicate={() => onDuplicateOpportunity(op.id)}
              onViewVolunteers={() => handleOpenVolunteerList(op)} // Pass the whole opportunity
              isManagerView={true}
            />
          ))}
        </div>
      )}
      {showFormModal && (
        <OpportunityFormModal
          opportunity={editingOpportunity}
          onClose={() => {
            setShowFormModal(false);
            setEditingOpportunity(null);
          }}
          onSave={handleFormSave}
        />
      )}
      {showVolunteerListModal && selectedOpportunityForVolunteers && (
        <VolunteerListModal
          opportunity={selectedOpportunityForVolunteers}
          onClose={handleCloseVolunteerList}
        />
      )}
    </div>
  );
}

// Opportunity Card (shared between public and admin)
function OpportunityCard({
  opportunity,
  onSignupClick,
  onEdit,
  onDelete,
  onDuplicate,
  onViewVolunteers,
  isManagerView,
}) {
  const spotsLeft =
    opportunity.volunteersNeeded - opportunity.volunteersSignedUp.length;
  const isFull = spotsLeft <= 0;

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-sky-300/50 flex flex-col">
      <div className="p-6 flex-grow">
        <h3 className="text-2xl font-semibold text-sky-700 mb-2">
          {opportunity.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 h-20 overflow-y-auto custom-scrollbar">
          {opportunity.description}
        </p>

        <div className="space-y-2 mb-4 text-sm">
          <div className="flex items-center text-gray-700">
            <CalendarDays size={18} className="mr-2 text-sky-600" />
            <span>
              {formatDate(opportunity.date)}
              {opportunity.endDate && opportunity.endDate !== opportunity.date
                ? ` - ${formatDate(opportunity.endDate)}`
                : ""}
            </span>
          </div>
          {opportunity.timeOfDay && (
            <div className="flex items-center text-gray-700">
              <Clock size={18} className="mr-2 text-sky-600" />
              <span>
                {opportunity.timeOfDay} ({opportunity.timeRange || "N/A"})
              </span>
            </div>
          )}
          <div className="flex items-center text-gray-700">
            <Users size={18} className="mr-2 text-sky-600" />
            <span>
              {spotsLeft > 0
                ? `${spotsLeft} of ${opportunity.volunteersNeeded} spots open`
                : "Opportunity Full"}
            </span>
          </div>
        </div>
        {isManagerView && opportunity.volunteersSignedUp.length > 0 && (
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm font-medium text-sky-700">
                Volunteers Signed Up ({opportunity.volunteersSignedUp.length}):
              </p>
              <button
                onClick={onViewVolunteers} // Modified: Now calls onViewVolunteers passed from AdminPanel
                className="text-xs bg-sky-100 hover:bg-sky-200 text-sky-700 font-semibold py-1 px-2 rounded-md flex items-center space-x-1 transition-colors"
              >
                <ClipboardCopy size={14} />
                <span>Export List</span>
              </button>
            </div>
            <ul className="list-disc list-inside text-xs text-gray-600 max-h-20 overflow-y-auto custom-scrollbar p-1 bg-gray-50 rounded">
              {opportunity.volunteersSignedUp.map((v) => (
                <li key={v.email}>
                  {v.name} ({v.email})
                </li>
              ))}
            </ul>
          </div>
        )}
        {isManagerView && opportunity.volunteersSignedUp.length === 0 && (
          <p className="text-xs text-gray-500 mb-3">
            No volunteers signed up yet.
          </p>
        )}
      </div>

      <div className="bg-gray-50 p-4">
        {isManagerView ? (
          <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 sm:space-x-2">
            <button
              onClick={onEdit}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-3 rounded-md text-sm flex items-center justify-center space-x-1 transition-colors"
            >
              <Edit3 size={16} />
              <span>Edit</span>
            </button>
            <button
              onClick={onDuplicate}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-3 rounded-md text-sm flex items-center justify-center space-x-1 transition-colors"
            >
              <Copy size={16} />
              <span>Duplicate</span>
            </button>
            <button
              onClick={onDelete}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded-md text-sm flex items-center justify-center space-x-1 transition-colors"
            >
              <Trash2 size={16} />
              <span>Delete</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => onSignupClick(opportunity)}
            disabled={isFull}
            className={`w-full font-bold py-3 px-4 rounded-lg shadow-md transition duration-150 ease-in-out flex items-center justify-center space-x-2 text-lg
              ${
                isFull
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-teal-500 hover:bg-teal-600 text-white"
              }`}
          >
            <UserPlus size={20} />
            <span>{isFull ? "Full" : "Sign Up"}</span>
          </button>
        )}
      </div>
    </div>
  );
}

// Modal for Signup Form
function SignupModal({ opportunity, onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      alert("Please fill in all fields.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    onSubmit({ name, email, phone, signupDate: new Date().toISOString() });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-[60] transition-opacity duration-300">
      {" "}
      {/* Increased z-index */}
      <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-md transform transition-all duration-300 scale-100 opacity-100">
        <h2 className="text-2xl font-semibold text-sky-700 mb-2">
          Sign Up For:
        </h2>
        <h3 className="text-xl text-sky-600 mb-6">{opportunity.title}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-md shadow-sm flex items-center space-x-2"
            >
              <Send size={16} /> <span>Submit Signup</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Modal for Opportunity Form (Create/Edit)
function OpportunityFormModal({ opportunity, onClose, onSave }) {
  const [title, setTitle] = useState(opportunity?.title || "");
  const [description, setDescription] = useState(
    opportunity?.description || ""
  );
  const [date, setDate] = useState(opportunity?.date || getTodayDateString());
  const [endDate, setEndDate] = useState(opportunity?.endDate || "");
  const [isDateRange, setIsDateRange] = useState(!!opportunity?.endDate);
  const [timeOfDay, setTimeOfDay] = useState(
    opportunity?.timeOfDay || "All Day"
  );
  const [timeRange, setTimeRange] = useState(opportunity?.timeRange || "");
  const [volunteersNeeded, setVolunteersNeeded] = useState(
    opportunity?.volunteersNeeded || 1
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !date || !volunteersNeeded) {
      alert("Please fill in Title, Date, and Volunteers Needed.");
      return;
    }
    if (parseInt(volunteersNeeded, 10) <= 0) {
      alert("Number of volunteers needed must be greater than zero.");
      return;
    }
    if (isDateRange && !endDate) {
      alert("Please provide an end date for the date range.");
      return;
    }
    if (isDateRange && new Date(endDate) < new Date(date)) {
      alert("End date cannot be before the start date.");
      return;
    }

    onSave({
      title,
      description,
      date,
      endDate: isDateRange ? endDate : null,
      timeOfDay,
      timeRange,
      volunteersNeeded: parseInt(volunteersNeeded, 10),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-[60]">
      {" "}
      {/* Increased z-index */}
      <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto custom-scrollbar">
        <h2 className="text-2xl font-semibold text-sky-700 mb-6">
          {opportunity ? "Edit Opportunity" : "Create New Opportunity"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="oppTitle"
              className="block text-sm font-medium text-gray-700"
            >
              Opportunity Title
            </label>
            <input
              type="text"
              id="oppTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 block w-full input-style"
            />
          </div>
          <div>
            <label
              htmlFor="oppDesc"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="oppDesc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="mt-1 block w-full input-style"
            ></textarea>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="isDateRange"
              checked={isDateRange}
              onChange={(e) => setIsDateRange(e.target.checked)}
              className="h-4 w-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
            />
            <label
              htmlFor="isDateRange"
              className="text-sm font-medium text-gray-700"
            >
              Is this a date range?
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="oppDate"
                className="block text-sm font-medium text-gray-700"
              >
                {isDateRange ? "Start Date" : "Date"}
              </label>
              <input
                type="date"
                id="oppDate"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="mt-1 block w-full input-style"
                min={getTodayDateString()}
              />
            </div>
            {isDateRange && (
              <div>
                <label
                  htmlFor="oppEndDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  End Date
                </label>
                <input
                  type="date"
                  id="oppEndDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required={isDateRange}
                  className="mt-1 block w-full input-style"
                  min={date || getTodayDateString()}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="oppTimeOfDay"
                className="block text-sm font-medium text-gray-700"
              >
                Time of Day (Optional)
              </label>
              <select
                id="oppTimeOfDay"
                value={timeOfDay}
                onChange={(e) => setTimeOfDay(e.target.value)}
                className="mt-1 block w-full input-style"
              >
                <option value="All Day">All Day</option>
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
                <option value="Custom">Custom (Specify Range)</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="oppTimeRange"
                className="block text-sm font-medium text-gray-700"
              >
                Specific Time Range (e.g., 9 AM - 1 PM)
              </label>
              <input
                type="text"
                id="oppTimeRange"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                placeholder="e.g., 09:00 - 13:00"
                className="mt-1 block w-full input-style"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="oppVolunteers"
              className="block text-sm font-medium text-gray-700"
            >
              Number of Volunteers Needed
            </label>
            <input
              type="number"
              id="oppVolunteers"
              value={volunteersNeeded}
              onChange={(e) => setVolunteersNeeded(e.target.value)}
              required
              min="1"
              className="mt-1 block w-full input-style"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md shadow-sm flex items-center space-x-2"
            >
              <Send size={16} /> <span>Save Opportunity</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// New Modal for Displaying and Copying Volunteer List as CSV
function VolunteerListModal({ opportunity, onClose }) {
  const [copied, setCopied] = useState(false);

  // Generate CSV string from volunteers
  const generateCSV = useCallback(() => {
    if (
      !opportunity ||
      !opportunity.volunteersSignedUp ||
      opportunity.volunteersSignedUp.length === 0
    ) {
      return "No volunteers signed up yet.";
    }
    const header = "Name,Email,Phone\n";
    const rows = opportunity.volunteersSignedUp
      .map((v) => `${v.name},${v.email},${v.phone}`)
      .join("\n");
    return header + rows;
  }, [opportunity]);

  const csvData = generateCSV();

  const handleCopy = () => {
    navigator.clipboard
      .writeText(csvData)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset copied status after 2 seconds
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        alert(
          "Failed to copy list. You can manually select and copy from the text area."
        );
      });
  };

  if (!opportunity) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-[70]">
      {" "}
      {/* Highest z-index */}
      <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-sky-700 mb-1">
          Volunteer List for:
        </h2>
        <h3 className="text-xl text-sky-600 mb-4">{opportunity.title}</h3>

        <p className="text-sm text-gray-600 mb-2">
          The list below is in CSV (Comma Separated Values) format. You can copy
          it directly into a spreadsheet or email.
        </p>
        <textarea
          readOnly
          value={csvData}
          className="w-full h-48 p-2 border border-gray-300 rounded-md shadow-sm text-sm font-mono bg-gray-50 custom-scrollbar"
          aria-label="Volunteer list in CSV format"
        />
        <div className="flex justify-end space-x-3 mt-4">
          <button
            onClick={handleCopy}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm flex items-center space-x-2 ${
              copied ? "bg-green-500" : "bg-sky-600 hover:bg-sky-700"
            }`}
          >
            <ClipboardCopy size={16} />
            <span>{copied ? "Copied!" : "Copy to Clipboard"}</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = `
  .input-style {
    box-sizing: border-box; 
    border-width: 1px;
    border-color: #D1D5DB; /* gray-300 */
    border-radius: 0.375rem; /* rounded-md */
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
    padding-left: 0.75rem; /* px-3 */
    padding-right: 0.75rem; /* px-3 */
    padding-top: 0.5rem; /* py-2 */
    padding-bottom: 0.5rem; /* py-2 */
    width: 100%; /* Ensure it takes full width of parent */
  }
  .input-style:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
    --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
    --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);
    box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
    border-color: #0EA5E9; /* sky-500 */
    --tw-ring-color: #0EA5E9; /* sky-500 */
  }
  /* Custom scrollbar for textareas */
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1; /* cool-gray-300 */
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #94a3b8; /* cool-gray-400 */
  }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default App;
