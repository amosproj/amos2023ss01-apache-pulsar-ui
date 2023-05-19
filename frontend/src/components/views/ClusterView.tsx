import React from 'react'
import graph1 from '../../assets/images/demo-graph1.png'
import graph2 from '../../assets/images/demo-graph2.png'

const ClusterView: React.FC<ClusterViewProps> = ({ data, handleClick }) => {
	return (
		<div className="flex flex-col card-content">
			<h2 className="uppercase">{data.id}</h2>
			<div className="flex card-inner">
				<div className="flex flex-col card-col card-col-1">
					<div className="flex flex-col card-info">
						<p className="text-black">
							Brokers:{' '}
							<span className="text-blue">
								{data?.brokers?.length > 0 ? data.brokers.length : 0}
							</span>
						</p>
						<p className="text-black">
							Bookies:{' '}
							<span className="text-blue">
								{data?.bookies
									? data.bookies.length
										? data.bookies.length
										: 0
									: 0}
							</span>
						</p>
					</div>
					<div className="grey-line"></div>
					<div className="flex flex-col card-info">
						<p className="text-black">
							Namespaces:{' '}
							<span className="text-blue">
								{data?.amountOfNamespaces ? data.amountOfNamespaces : 0}
							</span>
						</p>
						<p className="text-black">
							Topics:{' '}
							<span className="text-blue">
								{data?.amountOfTopics ? data.amountOfTopics : 0}
							</span>
						</p>
					</div>
					<div className="grey-line"></div>
					<div className="flex flex-col card-info">
						<p className="text-black">
							Service URL:{' '}
							<span className="text-blue">
								{data?.serviceUrl ? data.serviceUrl : 'N/A'}
							</span>
						</p>
						<p className="text-black">
							Broker Service URL:{' '}
							<span className="text-blue">
								{data?.brokerServiceUrl ? data.brokerServiceUrl : 'N/A'}
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

export default ClusterView
