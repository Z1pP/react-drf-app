

export default function NavBarModal({children, showModal}) {

    if (!showModal) {
        return null;
    }
    
    return (
        <div className="modal__wrapper">
            <div className="modal__overlay">
                {children}
            </div>
        </div>
        
    )
}