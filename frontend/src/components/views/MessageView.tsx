import React from 'react'
import graph1 from '../../assets/images/demo-graph1.png'
import graph2 from '../../assets/images/demo-graph2.png'

const MessageView: React.FC<MessageViewProps> = ({ data }) => {
	return (
		<div className="flex flex-col card-content">
			<h2 className="uppercase">{data?.payload}</h2>
			<div className="flex card-inner">
				<div className="flex flex-col card-col card-col-1">
					<div className="flex flex-col card-info">
						<p className="text-black">
							Cluster:{' '}
							<span className="text-blue">
								{data?.cluster ? data.cluster : 'N/A'}
							</span>
						</p>
						<p className="text-black">
							Tenant:{' '}
							<span className="text-blue">
								{data?.tenant ? data.tenant : 'N/A'}
							</span>
						</p>
						<p className="text-black">
							Namespace:{' '}
							<span className="text-blue">
								{data?.namespace ? data.namespace : 'N/A'}
							</span>
						</p>
						<p className="text-black">
							Topic:{' '}
							<span className="text-blue">
								{data?.topic ? data.topic : 'N/A'}
							</span>
						</p>
					</div>
					<div className="grey-line"></div>
					<div className="flex flex-col card-info">
						<p className="text-black">
							Schema:{' '}
							<span className="text-blue">
								{data?.schema ? data.schema : 'N/A'}
							</span>
						</p>
						<p className="text-black">
							Message ID:{' '}
							<span className="text-blue">{data?.id ? data.id : 'N/A'}</span>
						</p>
						<p className="text-black">
							Publish time:{' '}
							<span className="text-blue">
								{data?.publishTime ? data.publishTime : 'N/A'}
							</span>
						</p>
					</div>
				</div>
				<div className="flex flex-col card-col card-col-2">
					<img className="my-auto" src={graph2}></img>
				</div>
				<div className="flex flex-col card-col card-col-3">
					<img className="my-auto" src={graph1}></img>
				</div>
			</div>
		</div>
	)
}

export default MessageView
