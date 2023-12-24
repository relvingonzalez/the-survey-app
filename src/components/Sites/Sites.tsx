'use client'

import { Site } from '@/lib/types/sites';
import { Group, Table, Text } from '@mantine/core';
import { IconInfoCircleFilled, IconDownload, IconSettingsFilled } from '@tabler/icons-react';
import Link from 'next/link';

type SitesProps = {
    sites: Site[];
    download?: boolean
};

const siteProgress = (site: Site) => {
    return (
        <Table withColumnBorders>
            <Table.Tbody>
                <Table.Tr>
                    <Table.Td>
                        Questions:
                    </Table.Td>
                    <Table.Td>
                        1/20
                    </Table.Td>
                </Table.Tr>
                <Table.Tr>
                    <Table.Td>
                        Sketches:
                    </Table.Td>
                    <Table.Td>
                        3
                    </Table.Td>
                </Table.Tr>
                <Table.Tr>
                    <Table.Td>
                        Processes:
                    </Table.Td>
                    <Table.Td>
                        5/10
                    </Table.Td>
                </Table.Tr>
            </Table.Tbody>
        </Table>
    )
}

function Sites({ sites, download }: SitesProps) {
  const rows = sites.map((site, index) => (
    <Table.Tr key={`${site.siteCode}-${index}`}>
      <Table.Td>{site.siteCode}</Table.Td>
      <Table.Td>
            <Text>{site.location}</Text>
            {download && <Text>{site.questionnaire ? 'Yes' : 'No'}</Text>}
      </Table.Td>
      {!download && 
        <Table.Td>
            {siteProgress(site)}
        </Table.Td>}
      <Table.Td>
        {download ? 
            <Group>
                <IconInfoCircleFilled className="text-red" />
                <IconDownload />
            </Group> : 
            <Group>
                <Link href={`local/${site.siteCode}/site-overview`}><IconSettingsFilled /></Link>
            </Group>}
      </Table.Td>
    </Table.Tr>
  ));

  const ths = (
    <Table.Tr>
      <Table.Th>Site Code</Table.Th>
      <Table.Th>Location</Table.Th>
      {!download && <Table.Th>Progress</Table.Th>}
      <Table.Th>Action(s)</Table.Th>
    </Table.Tr>
  );

  return (
    <Table captionSide="bottom" withColumnBorders>
      <Table.Thead bg="var(--mantine-color-gray-light)">{ths}</Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
      <Table.Tfoot bg="var(--mantine-color-gray-light)">{ths}</Table.Tfoot>
    </Table>
  );
}

export function DownloadSites({sites}: SitesProps ) {
    return <Sites sites={sites} download/>
}

export function LocalSites({sites}: SitesProps) {
    return <Sites sites={sites} />
}