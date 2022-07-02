import { Wrapper, Buttons } from './styles';

interface ModalProps {
  title: string;
  description: string;
  accept: string;
  decline: string;
  handleAccept: () => Promise<void> | void;
  handleDecline: () => Promise<void> | void;
  enableExit: boolean;
}

const Modal = ({ title, description, accept, decline, handleAccept, handleDecline, enableExit }: ModalProps) => {
  return (
    <Wrapper>
      <p>{title}</p>
      <span>{description}</span>
      <Buttons>
        <button type="button" onClick={handleAccept}>
          {accept}
        </button>
        {enableExit && 
        <button type="button" onClick={handleDecline}>
          {decline}
        </button>}
      </Buttons>
    </Wrapper>
  );
};

export default Modal;
