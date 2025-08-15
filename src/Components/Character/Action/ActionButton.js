import React, { useState } from 'react';
import ActionModal from './ActionModal';

const ActionButton = ({ characteristics, skills, objects }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-purple-700 text-white px-4 py-2 rounded"
      >
        ACTION
      </button>
      {open && (
        <ActionModal
          onClose={() => setOpen(false)}
          characteristics={characteristics}
          skills={skills}
          objects={objects}
        />
      )}
    </>
  );
};

export default ActionButton;
