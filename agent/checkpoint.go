package agent

import (
	"context"
)

// checkpoint allows a goroutine to communicate when it is OK to proceed beyond some async condition
// to other dependent goroutines.
type checkpoint struct {
	done chan struct{}
	err  error
}

// complete the checkpoint.  Pass nil to indicate the checkpoint was ok.
func (c *checkpoint) complete(err error) {
	c.err = err
	close(c.done)
}

func (c *checkpoint) wait(ctx context.Context) error {
	select {
	case <-ctx.Done():
		return ctx.Err()
	case <-c.done:
		return c.err
	}
}

func newCheckpoint() *checkpoint {
	return &checkpoint{
		done: make(chan struct{}),
	}
}
