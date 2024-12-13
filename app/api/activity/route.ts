import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import User from '@/app/models/User'
import connectDB from '@/app/lib/mongodb'
import { CACHE_TAG_ACTIVITY } from '@/app/lib/cache'

export async function GET(
    request: NextRequest
): Promise<NextResponse> {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await connectDB()

        const url = new URL(request.url)
        const searchParams = url.searchParams
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('size') || '10')
        const type = searchParams.get('type')
        const userId = searchParams.get('userId')
        const challengeId = searchParams.get('challengeId')

        // Create a cache key based on the query parameters
        const cacheKey = `${page}-${limit}-${type || ''}-${userId || ''}-${challengeId || ''}`

        const skip = (page - 1) * limit

        // Build match conditions based on query parameters
        const matchConditions: any = {}
        if (type) matchConditions.type = type
        if (userId) matchConditions['actor._id'] = userId
        if (challengeId) matchConditions['data.challenge._id'] = challengeId

        // Create a union of all activities using $unionWith
        const activities = await User.aggregate([
            // Start with NEW_USER activities
            {
                $project: {
                    type: { $literal: 'NEW_USER' },
                    actor: {
                        _id: '$_id',
                        name: '$name',
                        imageUrl: '$image'
                    },
                    data: {
                        _id: '$_id',
                        name: '$name',
                        imageUrl: '$image'
                    },
                    createdAt: '$createdAt'
                }
            },

            // Union with NEW_DOG activities
            {
                $unionWith: {
                    coll: 'dogs',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'users',
                                let: { userId: { $toObjectId: '$userId' } },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: { $eq: ['$_id', '$$userId'] }
                                        }
                                    }
                                ],
                                as: 'user'
                            }
                        },
                        {
                            $unwind: '$user'
                        },
                        {
                            $project: {
                                type: { $literal: 'NEW_DOG' },
                                actor: {
                                    _id: '$user._id',
                                    name: '$user.name',
                                    imageUrl: '$user.imageUrl'
                                },
                                data: {
                                    _id: '$_id',
                                    name: '$name',
                                    imageUrl: '$imageUrl'
                                },
                                createdAt: '$createdAt'
                            }
                        }
                    ]
                }
            },

            // Union with NEW_CHALLENGE activities
            {
                $unionWith: {
                    coll: 'challenges',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'users',
                                let: { userId: { $toObjectId: '$createdBy' } },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: { $eq: ['$_id', '$$userId'] }
                                        }
                                    }
                                ],
                                as: 'user'
                            }
                        },
                        {
                            $unwind: '$user'
                        },
                        {
                            $project: {
                                type: { $literal: 'NEW_CHALLENGE' },
                                actor: {
                                    _id: '$user._id',
                                    name: '$user.name',
                                    imageUrl: '$user.imageUrl'
                                },
                                data: {
                                    _id: '$_id',
                                    title: '$title',
                                    icon: '$icon'
                                },
                                createdAt: '$createdAt'
                            }
                        }
                    ]
                }
            },

            // Union with CHALLENGE_ACCEPTED activities
            {
                $unionWith: {
                    coll: 'dogchallenges',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'dogs',
                                let: { dogId: { $toObjectId: '$dogId' } },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: { $eq: ['$_id', '$$dogId'] }
                                        }
                                    }
                                ],
                                as: 'dog'
                            }
                        },
                        {
                            $lookup: {
                                from: 'challenges',
                                let: { challengeId: { $toObjectId: '$challengeId' } },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: { $eq: ['$_id', '$$challengeId'] }
                                        }
                                    }
                                ],
                                as: 'challenge'
                            }
                        },
                        {
                            $lookup: {
                                from: 'users',
                                let: { userId: { $toObjectId: '$createdBy' } },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: { $eq: ['$_id', '$$userId'] }
                                        }
                                    }
                                ],
                                as: 'user'
                            }
                        },
                        {
                            $unwind: '$user'
                        },
                        {
                            $unwind: '$dog'
                        },
                        {
                            $unwind: '$challenge'
                        },
                        {
                            $project: {
                                type: { $literal: 'CHALLENGE_ACCEPTED' },
                                actor: {
                                    _id: '$user._id',
                                    name: '$user.name',
                                    imageUrl: '$user.imageUrl'
                                },
                                data: {
                                    _id: '$_id',
                                    dog: {
                                        _id: '$dog._id',
                                        name: '$dog.name',
                                        imageUrl: '$dog.imageUrl'
                                    },
                                    challenge: {
                                        _id: '$challenge._id',
                                        title: '$challenge.title',
                                        icon: '$challenge.icon'
                                    }
                                },
                                createdAt: '$createdAt'
                            }
                        }
                    ]
                }
            },

            // Add new union with CHALLENGE_COMPLETED activities
            {
                $unionWith: {
                    coll: 'dogchallenges',
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$progress.current', '$progress.goal'] },
                                completedDate: { $exists: true }
                            }
                        },
                        {
                            $lookup: {
                                from: 'dogs',
                                let: { dogId: { $toObjectId: '$dogId' } },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: { $eq: ['$_id', '$$dogId'] }
                                        }
                                    }
                                ],
                                as: 'dog'
                            }
                        },
                        {
                            $lookup: {
                                from: 'challenges',
                                let: { challengeId: { $toObjectId: '$challengeId' } },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: { $eq: ['$_id', '$$challengeId'] }
                                        }
                                    }
                                ],
                                as: 'challenge'
                            }
                        },
                        {
                            $lookup: {
                                from: 'users',
                                let: { userId: { $toObjectId: '$createdBy' } },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: { $eq: ['$_id', '$$userId'] }
                                        }
                                    }
                                ],
                                as: 'user'
                            }
                        },
                        {
                            $unwind: '$user'
                        },
                        {
                            $unwind: '$dog'
                        },
                        {
                            $unwind: '$challenge'
                        },
                        {
                            $project: {
                                type: { $literal: 'CHALLENGE_COMPLETED' },
                                actor: {
                                    _id: '$user._id',
                                    name: '$user.name',
                                    imageUrl: '$user.imageUrl'
                                },
                                data: {
                                    _id: '$_id',
                                    dog: {
                                        _id: '$dog._id',
                                        name: '$dog.name',
                                        imageUrl: '$dog.imageUrl'
                                    },
                                    challenge: {
                                        _id: '$challenge._id',
                                        title: '$challenge.title',
                                        icon: '$challenge.icon'
                                    }
                                },
                                createdAt: '$completedDate'
                            }
                        }
                    ]
                }
            },

            // Match conditions from query parameters
            {
                $match: matchConditions
            },

            // Sort by creation date, newest first
            {
                $sort: { createdAt: -1 }
            },

            // Get total count before pagination
            {
                $facet: {
                    metadata: [{ $count: 'total' }],
                    data: [{ $skip: skip }, { $limit: limit }]
                }
            }
        ])

        const result = activities[0]
        const total = result.metadata[0]?.total || 0
        const activityList = result.data

        return NextResponse.json({
            activities: activityList,
            pagination: {
                currentPage: page,
                pageSize: limit,
                totalItems: total,
                totalPages: Math.ceil(total / limit)
            }
        }, {
            headers: {
                'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
                'Tags': `${CACHE_TAG_ACTIVITY}-${cacheKey}`,
            },
        })

    } catch (error) {
        console.error('Error fetching activity:', error)
        return NextResponse.json(
            { error: 'Failed to fetch activity' },
            { status: 500 }
        )
    }
}