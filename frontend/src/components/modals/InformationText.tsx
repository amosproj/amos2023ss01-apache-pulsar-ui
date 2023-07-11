import React from 'react'

interface ModalInfoProps {
	title: string
	detailedInfo: boolean | number | string | undefined
}

/**
 * InformationText is a react component for displaying detailed information for other
 * modals.
 *
 * @component
 * @param title - The title of information.
 * @param detailedInfo - The detail of information.
 * @returns Rendered InformationText.
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
