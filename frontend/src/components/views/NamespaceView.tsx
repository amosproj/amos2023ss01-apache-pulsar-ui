import React from 'react'
import graph1 from '../../assets/images/demo-graph1.png'
import graph2 from '../../assets/images/demo-graph2.png'

const NamespaceView: React.FC<NamespaceViewProps> = ({ data, handleClick }) => {
	return (
		<div className="flex flex-col card-content">
			<h2 className="uppercase">{data.id}</h2>
			<div className="flex card-inner">
				<div className="flex flex-col card-col card-col-1">
					<div className="flex flex-col card-info">
						<p className="text-black">
							Bundles:{' '}
							<span className="text-blue">
								{data?.bundlesData?.numBundles
									? data.bundlesData?.numBundles
									: 0}
							</span>
						</p>
						<p className="text-black">
							Message TTL:{' '}
							<span className="text-blue">
								{data?.messagesTTL ? data?.messagesTTL : 'None'}
							</span>
						</p>
						<p className="text-black">
							Retention time:{' '}
							<span className="text-blue">
								{data?.retentionPolicies?.retentionTimeInMinutes
									? data?.retentionPolicies.retentionTimeInMinutes + ' minutes'
									: 'None'}
							</span>
						</p>
						<p className="text-black">
							Retention size:{' '}
							<span className="text-blue">
								{data?.retentionPolicies?.retentionSizeInMB
									? data?.retentionPolicies.retentionSizeInMB + ' MB'
									: 'None'}
							</span>
						</p>
					</div>
					<div className="grey-line"></div>
					<div className="flex flex-col card-info">
						<p className="text-black">
							Cluster:{' '}
							<span className="text-blue">
								{data?.cluster ? data.cluster : 'N/A'}
							</span>
						</p>
						<p className="text-black">
							Topics:{' '}
							<span className="text-blue">
								{data?.amountOfTopics ? data.amountOfTopics : 0}
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

export default NamespaceView
