"use client";
import useStore from "@/app/store/store";
import "./../../styles/loading-overlay.css";

function LoaderOverlay({ show }: any) {
  const { loading } = useStore();

  return (
    <>
      {(loading || show) && (
        <div className="modal fade show d-block" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-body">
              <div className="spinner-border"></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default LoaderOverlay;
