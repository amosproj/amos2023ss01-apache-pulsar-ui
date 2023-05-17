import React from 'react'
import graph1 from '../../assets/images/demo-graph1.png'
import graph2 from '../../assets/images/demo-graph2.png'

const TenantView: React.FC<TenantViewProps> = ({ data }) => {
	const tenantAdminRoles = data?.tenantInfo?.adminRoles

	return (
		<div className="flex flex-col card-content">
			<h2 className="uppercase">{data?.id}</h2>
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
							Admin Rolas:{' '}
							<span className="text-blue">
								{tenantAdminRoles &&
									tenantAdminRoles.length > 0 &&
									tenantAdminRoles.map((item: string, index: number) => (
										<span key={index}>{item}, </span>
									))}
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

export default TenantView
