import React from 'react';

interface TeamMember {
  name: string;
  role: string;
  email: string;
}

interface TeamTableProps {
  members: TeamMember[];
}

const TeamTable: React.FC<TeamTableProps> = ({ members }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse mt-5">
        <thead>
          <tr>
            <th className="border border-blue-400 bg-gray-100 p-3 text-left">Name</th>
            <th className="border border-blue-400 bg-gray-100 p-3 text-left">Role</th>
            <th className="border border-blue-400 bg-gray-100 p-3 text-left">Email</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="border border-blue-400 p-3">{member.name}</td>
              <td className="border border-blue-400 p-3">{member.role}</td>
              <td className="border border-blue-400 p-3">{member.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeamTable;