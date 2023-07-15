import React from 'react'

interface ModalInfoProps {
	title: string
	detailedInfo: boolean | number | string | undefined
}

/**
 * The InformationText component is adopted within other modals to display detailed information.
 *
 * @component
 * @param title - The title for the information.
 * @param detailedInfo - The detailed information.
 * @returns a styled block of text with a title.
 */
const InformationText: React.FC<ModalInfoProps> = ({ title, detailedInfo }) => {
	return (
		<div className="modal-info">
			<p className="title">{title}:</p>
			<p className="detail">
				{detailedInfo?.toString() ? detailedInfo.toString() : 'N/A'}
			</p>
		</div>
	)
}

export default InformationText
