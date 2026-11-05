import { Dialog, Transition } from "@headlessui/react";
import { ModalProvider, useModal } from "@lib/context/modal-context";
import { clx } from "@medusajs/ui";
import X from "@modules/common/icons/x";
import React, { Fragment } from "react";

interface ModalProps {
  isOpen: boolean;
  close: () => void;
  size?: "small" | "medium" | "large";
  search?: boolean;
  children: React.ReactNode;
  "data-testid"?: string;
}

const Modal = ({
  isOpen,
  close,
  size = "medium",
  search = false,
  children,
  "data-testid": dataTestId,
}: ModalProps) => (
  <Transition appear show={isOpen} as={Fragment}>
    <Dialog as="div" className="relative z-[75]" onClose={close}>
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="bg-opacity-75 fixed inset-0 h-screen backdrop-blur-md" />
      </Transition.Child>

      <div className="fixed inset-0 overflow-y-hidden">
        <div
          className={clx(
            "flex min-h-full h-full justify-center p-4 text-center",
            {
              "items-center": !search,
              "items-start": search,
            }
          )}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel
              data-testid={dataTestId}
              className={clx(
                "flex flex-col justify-start w-full transform p-5 text-left align-middle transition-all max-h-[75vh] h-fit",
                {
                  "bg-transparent shadow-none": search,
                  "bg-white shadow-xl border rounded-rounded": !search,
                  "max-w-3xl": size === "large",
                  "max-w-md": size === "small",
                  "max-w-xl": size === "medium",
                }
              )}
            >
              <ModalProvider close={close}>{children}</ModalProvider>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition>
);

const Title: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { close } = useModal();

  return (
    <Dialog.Title className="flex items-center justify-between">
      <div className="text-large-semi">{children}</div>
      <div>
        <button onClick={close} data-testid="close-modal-button">
          <X size={20} />
        </button>
      </div>
    </Dialog.Title>
  );
};

const Description: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Dialog.Description className="text-small-regular text-ui-fg-base flex h-full items-center justify-center pt-2 pb-4">
    {children}
  </Dialog.Description>
);

const Body: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex justify-center">{children}</div>
);

const Footer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center justify-end gap-x-4">{children}</div>
);

Modal.Title = Title;
Modal.Description = Description;
Modal.Body = Body;
Modal.Footer = Footer;

export default Modal;
