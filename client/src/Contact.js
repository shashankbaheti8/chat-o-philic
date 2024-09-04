import Avatar from "./Avatar.js";

export default function Contact({ id, username, onClick, selected, online }) {

  const handleClick = () => {
    onClick(id);
  };

  return (
    <div
      key={id}
      onClick={handleClick}
      className={`border-b border-gray-100 flex items-center cursor-pointer 
        ${selected ? 'bg-gray-200 shadow-lg' : ''} transition-all duration-200`}
    >
      {selected && <div className="h-12 rounded-r-md"></div>}
      <div className="flex gap-2 py-2 pl-4 items-center">
        <Avatar online={online} username={username} userId={id} />
        <span className="text-gray-800">{username}</span>
      </div>
    </div>
  );
}
