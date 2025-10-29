import globalConfig from '../../global.config'

const addHours = (date: Date, hours: number) => {
  return new Date(date.getTime() + hours * 60 * 60 * 1000)
}

const checkCredits = async () => {
  const creditsCountStr = await figma.clientStorage.getAsync('credits_count')
  const renewDateStr = await figma.clientStorage.getAsync('credits_renew_date')
  const creditsVersion = await figma.clientStorage.getAsync('credits_version')

  const now = new Date()

  let creditsCount =
    creditsCountStr !== null ? parseFloat(creditsCountStr) : NaN
  let renewDate: Date | null =
    renewDateStr !== null && !Number.isNaN(parseInt(renewDateStr, 10))
      ? new Date(parseInt(renewDateStr, 10))
      : null

  const periodHours =
    globalConfig.plan.creditsRenewalPeriodHours ??
    globalConfig.plan.creditsRenewalPeriodDays * 24

  if (renewDate === null) {
    const next = addHours(now, periodHours)
    figma.clientStorage.setAsync(
      'credits_renew_date',
      next.getTime().toString()
    )
    renewDate = next
  }

  if (renewDate && renewDate.getTime() <= now.getTime()) {
    figma.clientStorage.setAsync(
      'credits_count',
      globalConfig.plan.creditsLimit.toString()
    )
    const next = addHours(now, periodHours)
    figma.clientStorage.setAsync(
      'credits_renew_date',
      next.getTime().toString()
    )
    creditsCount = globalConfig.plan.creditsLimit
  }

  if (Number.isNaN(creditsCount)) {
    figma.clientStorage.setAsync(
      'credits_count',
      globalConfig.plan.creditsLimit.toString()
    )
    creditsCount = globalConfig.plan.creditsLimit
  }

  if (creditsVersion !== globalConfig.versions.creditsVersion) {
    figma.clientStorage.setAsync(
      'credits_version',
      globalConfig.versions.creditsVersion
    )
    figma.clientStorage.setAsync(
      'credits_count',
      globalConfig.plan.creditsLimit.toString()
    )
    const next = addHours(now, periodHours)
    figma.clientStorage.setAsync(
      'credits_renew_date',
      next.getTime().toString()
    )
    creditsCount = globalConfig.plan.creditsLimit
    renewDate = next
  }

  figma.ui.postMessage({
    type: 'CHECK_CREDITS',
    data: {
      creditsCount: creditsCount,
      creditsRenewalDate: renewDate?.getTime() ?? null,
    },
  })

  return creditsCount
}

export default checkCredits
