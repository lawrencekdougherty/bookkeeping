import { Card, Typography, Grid, Divider, Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Balance from '../../interfaces/Balance';
import { formatDate, useFetch } from '../../Utils';
import AmountChip from '../atoms/AmountChip';
import IsFetching from '../atoms/IsFetching';
import Empty from '../molecules/Empty';

const loadReport = () => {
  return useFetch<Balance[]>('/reports/balances').then((data) =>
    data.map((x) => ({
      ...x,
      bookingDate: new Date(x.bookingDate),
    }))
  );
};

type ReportBalancesProps = {};

export default function ReportBalances(_props: ReportBalancesProps) {
  const [report, setReport] = useState<Balance[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(true);

  useEffect(() => {
    setIsFetching(true);
    loadReport().then((x) => {
      setReport(x);
      setIsFetching(false);
    });
  }, []);

  return (
    <IsFetching isFetching={isFetching}>
      <Empty items={report} text="No balances recorded yet, did you setup accounts?">
        <Card sx={{ padding: '10px' }}>
          {report.map((balance) => (
            <Box key={balance.iban}>
              <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                  <Typography sx={{ fontSize: 10 }} color="text.secondary" gutterBottom>
                    {balance.iban} · {formatDate(balance.bookingDate)}
                  </Typography>

                  <Typography variant="h6" component="div">
                    {balance.account ?? '-'}
                  </Typography>
                </Grid>
                <Grid item>
                  <AmountChip amount={balance.amount / 100} hidePrefix={true} />
                </Grid>
              </Grid>
              <Divider />
            </Box>
          ))}
        </Card>
      </Empty>
    </IsFetching>
  );
}
