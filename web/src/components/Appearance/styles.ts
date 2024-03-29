import styled from 'styled-components';

export const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;

  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  overflow: hidden;
`;

export const Container = styled.div`
  height: 100%;
  width: 20%;
  max-width: 400px;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  padding: 40px 10px;

  background: linear-gradient(
    to right,
    rgba(${props => props.theme.secondaryBackground || '0, 0, 0'}, 0.8),
    rgba(${props => props.theme.secondaryBackground || '0, 0, 0'}, 0)
  );

  overflow-y: scroll;

  ::-webkit-scrollbar {
    width: 0px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(${props => props.theme.primaryBackground || '0, 0, 0'}, 0.2);
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(${props => props.theme.primaryBackground || '0, 0, 0'}, 0.2);
    border-radius: 3vh;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(${props => props.theme.primaryBackground || '0, 0, 0'}, 0.2);
  }
`;

export const FlexWrapper = styled.div`
  width: 100%;

  display: flex;

  > div {
    & + div {
      margin-left: 10px;
    }
  }
`;
