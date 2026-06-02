const CallHeader = ({ receiver }) => {
  return (
    <div className="absolute top-6 left-0 w-full z-50 text-center text-white">
      <h2 className="font-bold text-lg">{receiver?.username}</h2>

      <p className="text-sm opacity-70">Video Call</p>
    </div>
  );
};

export default CallHeader;
