import React from "react";
import MatchCard from "./MatchCard";

const MatchesList = ({ matches }) => {
  if (!matches || matches.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900">No matches found</h3>
        <p className="mt-2 text-sm text-gray-500">
          Try adjusting your filters or updating your skill profile to find more
          matches.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  );
};

export default MatchesList;
