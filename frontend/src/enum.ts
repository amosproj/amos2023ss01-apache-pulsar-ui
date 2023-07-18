// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2023 Julian Tochman-Szewc <tochman-szewc@campus.tu-berlin.de>
// SPDX-FileCopyrightText: 2023 Shahraz Nasir <shahraz.nasir@campus.tu-berlin.de>
// SPDX-FileCopyrightText: 2023 Ziqi He <ziqi.he@fau.de>
export enum Topology {
	CLUSTER = 'cluster',
	TENANT = 'tenant',
	NAMESPACE = 'namespace',
	TOPIC = 'topic',
	PRODUCER = 'producer',
	SUBSCRIPTION = 'subscription',
}
