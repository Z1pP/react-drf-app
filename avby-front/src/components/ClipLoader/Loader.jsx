import { ClipLoader } from "react-spinners";
import { css } from "@emotion/react";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

export default function Loader({ loading }) {
  return (
    <div className="loader-container" style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 9999, 
      backgroundColor: 'rgba(0, 0, 0, 0.5)', 
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <ClipLoader color={"blue"} loading={loading} size={100} css={override} />
    </div>
  );
}