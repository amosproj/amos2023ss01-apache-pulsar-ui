import React from 'react'
import graph1 from '../../assets/images/demo-graph1.png'
import graph2 from '../../assets/images/demo-graph2.png'
import ProducerModal from '../modals/ProducerModal'

const TopicView: React.FC<TopicViewProps> = ({ data, handleClick }) => {
	const topicConsumers = data?.topicStatsDto?.subscriptions
		.map((item: SampleSubscription) => item.consumers)
		.filter((el: Array<string>) => el.length > 0)
		.flat()

	const topicProducers = data?.topicStatsDto?.producers

	return (
		<div className="flex flex-col card-content">
			<h2 className="uppercase">{data?.localName}</h2>
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
					</div>
					<div className="grey-line"></div>
					<div className="flex flex-col card-info">
						<p className="text-black">
							Producers:{' '}
							<span className="text-blue">
								{topicProducers &&
									topicProducers.length > 0 &&
									topicProducers.map((item: string, index: number) => (
										<ProducerModal
											key={index}
											producer={{
												producerName: item,
												topicList: ['sdasd', 'sdasd'],
												messageList: ['sdasd', 'sdasd'],
											}}
										/>
									))}
							</span>
						</p>
						<p className="text-black">
							Consumers:{' '}
							<span className="text-blue">
								{topicConsumers &&
									topicConsumers.length > 0 &&
									topicConsumers.map((item: string, index: number) => (
										<span key={index}>{item}, </span>
									))}
							</span>
						</p>
					</div>
					<div className="grey-line"></div>
					<div className="flex flex-col card-info">
						<p className="text-black">
							Produced messages:{' '}
							<span className="text-blue">
								{data?.topicStatsDto?.producedMesages
									? data.topicStatsDto.producedMesages
									: 0}
							</span>
						</p>
						<p className="text-black">
							Average message size:{' '}
							<span className="text-blue">
								{data?.topicStatsDto?.averageMessageSize
									? data.topicStatsDto.averageMessageSize
									: 0}
							</span>
						</p>
						<p className="text-black">
							Storage size:{' '}
							<span className="text-blue">
								{data?.topicStatsDto?.storageSize
									? data.topicStatsDto.storageSize
									: 0}
							</span>
						</p>
					</div>
					<div>
						<a
							href="#"
							className="primary-button"
							onClick={(e) => handleClick(e, data)}
						>
							More information
						</a>
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

export default TopicView
