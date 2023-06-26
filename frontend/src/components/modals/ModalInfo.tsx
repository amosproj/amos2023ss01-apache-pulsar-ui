import React from 'react'

interface ModalInfoProps {
	title: string
	detailedInfo: boolean | number | string | undefined
}

const ModalInfo: React.FC<ModalInfoProps> = ({ title, detailedInfo }) => {
	return (
		<div className="modal-info">
			<p className="title">{title}:</p>
			<p className="detail">
				{detailedInfo?.toString() ? detailedInfo.toString() : 'N/A'}
			</p>
		</div>
	)
}

export default ModalInfo
