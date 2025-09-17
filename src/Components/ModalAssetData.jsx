"use client";
import { forwardRef, useImperativeHandle, useState } from "react";

const ModalAssetData = forwardRef((props, ref) => {
  const [asset, setAsset] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const { onClose } = props;

  useImperativeHandle(ref, () => ({
    open: (asset) => {
      setAsset(asset);
      setIsOpen(true);
    },
  }));

  function close() {
    setAsset(null);
    setIsOpen(false);
    onClose();
  }

  if (!isOpen) return;
  return (
    <>
      <div className="  h-[100%]  w-full flex justify-center items-center bg-gray-400/50">
        <div>hola</div>
        <div className="mt-10" onClick={close}>
          cerrar
        </div>
      </div>
    </>
  );
});

ModalAssetData.displayName = "ModalAssetData";
export default ModalAssetData;
