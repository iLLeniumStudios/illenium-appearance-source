import styled from 'styled-components';

interface ModalProps {
  title: string;
  description: string;
  accept: string;
  decline: string;
  handleAccept: () => Promise<void> | void;
  handleDecline: () => Promise<void> | void;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
`;

const ModalCard = styled.div`
  background: rgba(17, 25, 40, 0.95);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.125);
  padding: 32px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
  
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.02em;
`;

const Description = styled.p`
  margin: 0;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.65);
  line-height: 1.5;
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border-radius: 12px;
  border: 0;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  ${({ variant }) =>
    variant === 'secondary'
      ? `
      background: rgba(255, 255, 255, 0.05);
      color: #fff;
      &:hover {
        background: rgba(255, 255, 255, 0.1);
        transform: translateY(-2px);
      }
    `
      : `
      background: #0067f8;
      color: #fff;
      box-shadow: 0 4px 12px rgba(0, 103, 248, 0.3);
      &:hover {
        background: #1d7bff;
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 103, 248, 0.4);
      }
    `}

  &:active {
    transform: translateY(0);
  }
`;

const Modal = ({ title, description, accept, decline, handleAccept, handleDecline }: ModalProps) => {
  return (
    <Overlay onClick={handleDecline}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>{title}</Title>
          <Description>{description}</Description>
        </Header>
        <Actions>
          <ActionButton variant="secondary" onClick={handleDecline}>
            {decline}
          </ActionButton>
          <ActionButton onClick={handleAccept}>
            {accept}
          </ActionButton>
        </Actions>
      </ModalCard>
    </Overlay>
  );
};

export default Modal;
